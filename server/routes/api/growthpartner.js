// ======== routes/growthPartnerRoutes.js (FULL FILE) ========
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Bring in Models & Helpers
const { GROWTH_PARTNER_STATUS, ROLES } = require('../../constants');
const GrowthPartner = require('../../models/growthpartner');
const User = require('../../models/user');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const mailgun = require('../../services/mailgun');

// Register growth partner
router.post('/add', async (req, res) => {
  try {
    const { name, location, phoneNumber, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const existingGP = await GrowthPartner.findOne({ email });
    if (existingGP) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const gp = new GrowthPartner({ name, email, phoneNumber, location });
    const gpDoc = await gp.save();

    await mailgun.sendEmail(email, 'growth-partner-application');

    res.status(200).json({
      success: true,
      message: `Thanks for applying! We'll review and get in touch via ${phoneNumber}.`,
      growthpartner: gpDoc
    });
  } catch (error) {
    return res.status(400).json({ error: 'Could not process request.' });
  }
});

// Search growth partners
router.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;
    const regex = new RegExp(search, 'i');

    const partners = await GrowthPartner.find({
      $or: [
        { phoneNumber: { $regex: regex } },
        { email: { $regex: regex } },
        { name: { $regex: regex } },
        { status: { $regex: regex } }
      ]
    });

    res.status(200).json({ partners });
  } catch (error) {
    res.status(400).json({ error: 'Search failed.' });
  }
});

// Fetch all growth partners
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const partners = await GrowthPartner.find()
      .sort('-created')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await GrowthPartner.countDocuments();

    res.status(200).json({
      partners,
      growthpartners: partners,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    res.status(400).json({ error: 'Could not fetch partners.' });
  }
});

// Approve growth partner
router.put('/approve/:id', auth, async (req, res) => {
  try {
    const partnerId = req.params.id;
    const update = { status: GROWTH_PARTNER_STATUS.Approved, isActive: true };

    const partnerDoc = await GrowthPartner.findByIdAndUpdate(partnerId, update, { new: true });

    await createGrowthPartnerUser(partnerDoc.email, partnerDoc.name, partnerId, req.headers.host);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Approval failed.' });
  }
});

// Reject growth partner
router.put('/reject/:id', auth, async (req, res) => {
  try {
    const partnerId = req.params.id;
    const update = { status: GROWTH_PARTNER_STATUS.Rejected };

    await GrowthPartner.findByIdAndUpdate(partnerId, update, { new: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Rejection failed.' });
  }
});

// Delete growth partner
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const partnerId = req.params.id;
    const deleted = await GrowthPartner.deleteOne({ _id: partnerId });
    res.status(200).json({ success: true, message: 'Deleted successfully.', deleted });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed.' });
  }
});

// Growth partner referred merchants
// router.get('/referred-merchants', auth, role.check(ROLES.GrowthPartner), async (req, res) => {
//   try {
//     const partner = await GrowthPartner.findOne({ email: req.user.email })
//       .populate('referredMerchants');

//     if (!partner) {
//       return res.status(404).json({ message: 'Growth partner not found' });
//     }

//     res.status(200).json({
//       total: partner.referredMerchants.length,
//       merchants: partner.referredMerchants
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

const createGrowthPartnerUser = async (email, name, _partnerId, host) => {
  const firstName = name;
  const lastName = '';

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return await User.findOneAndUpdate(
      { _id: existingUser._id },
      { role: ROLES.GrowthPartner },
      { new: true }
    );
  } else {
    const buffer = await crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    const user = new User({
      email,
      firstName,
      lastName,
      resetPasswordToken: resetToken,
      role: ROLES.GrowthPartner
    });

    await mailgun.sendEmail(email, 'growth-partner-signup', host, {
      resetToken,
      email
    });

    return await user.save();
  }
};

module.exports = router;
