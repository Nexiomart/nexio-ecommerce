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
const multer = require('multer');
const { s3Upload, s3Delete } = require('../../utils/storage');
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Register growth partner
router.post('/add', async (req, res) => {
  try {
    const { name, region, phoneNumber, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const existingGP = await GrowthPartner.findOne({ email });
    if (existingGP) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const gp = new GrowthPartner({ name, email, phoneNumber, location: region });
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
// router.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
//   try {
//     const { search } = req.query;
//     // new RegExp(search, 'i')
//     const regex = new RegExp(`.*${search}.*`, 'i');

//     const partners = await GrowthPartner.find({
//       $or: [
//         { phoneNumber: { $regex: regex } },
//         { email: { $regex: regex } },
//         { name: { $regex: regex } },
//         {location: {$regex: regex}}
//       ]
//     });

//     res.status(200).json({ partners,
//       growthpartners: partners });
//   } catch (error) {
//     res.status(400).json({ error: 'Search failed.' });
//   }
// });
// Search growth partners
// router.get('/search', auth, async (req, res) => {
//   try {
//     const { search } = req.query;
//     const regex = new RegExp(search, 'i');

//     const partners = await GrowthPartner.find({
//       $or: [
//         { phoneNumber: { $regex: regex } },
//         { email: { $regex: regex } },
//         { name: { $regex: regex } },
//         { location: { $regex: regex } },
//         { status: { $regex: regex } }
//       ]
//     });

//     res.status(200).json({ partners,growthpartners: partners }); // ✅ ensure key is "growthpartners"
//   } catch (error) {
//     res.status(400).json({ error: 'Search failed. Please try again.' });
//   }
// });
router.get('/search', auth, role.check(ROLES.Admin, ROLES.Manufacturer), async (req, res) => {
  try {
    const { search } = req.query;

    // ✅ Validate search input
    if (!search || search.trim() === '') {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    // ✅ Trim and escape special regex characters
    const searchTerm = search.trim();
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'i');

    const partners = await GrowthPartner.find({
      $or: [
        { phoneNumber: { $regex: regex } },
        { email: { $regex: regex } },
        { name: { $regex: regex } },
        { location: { $regex: regex } },
        { status: { $regex: regex } }
      ]
    }).sort('-created');

    console.log(`Search for "${searchTerm}" found ${partners.length} results`);
    res.status(200).json({ growthpartners: partners, partners });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(400).json({ error: 'Search failed. Please try again.' });
  }
});


// Fetch all growth partners
router.get('/', auth, role.check(ROLES.Admin, ROLES.Manufacturer), async (req, res) => {
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

// Fetch growth partners referred by the logged-in Growth Partner
router.get('/referred', auth, role.check(ROLES.GrowthPartner), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('growthPartner');
    if (!user || !user.growthPartner) {
      return res.status(400).json({ error: 'Growth Partner profile not found.' });
    }
    const myUniqueId = user.growthPartner.uniqueId;
    const referred = await GrowthPartner.find({ referredBy: myUniqueId }).sort('-created');
    return res.status(200).json({
      partners: referred,
      growthpartners: referred,
      total: referred.length
    });
  } catch (error) {
    res.status(400).json({ error: 'Could not fetch referred growth partners.' });
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

const createGrowthPartnerUser = async (email, name, growthPartner, host) => {
  const firstName = name;
  const lastName = '';

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return await User.findOneAndUpdate(
      { _id: existingUser._id },
      { growthPartner ,role: ROLES.GrowthPartner },
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
      growthPartner,
      role: ROLES.GrowthPartner
    });

    await mailgun.sendEmail(email, 'growth-partner-signup', host, {
      resetToken,
      email
    });

    return await user.save();
  }
};

// Upload or replace profile image (Growth Partner only)
router.put('/profile-image', auth, role.check(ROLES.GrowthPartner), upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.growthPartner) {
      return res.status(400).json({ error: 'Growth Partner account not found.' });
    }
    const gp = await GrowthPartner.findById(user.growthPartner);
    if (!gp) return res.status(404).json({ error: 'Growth Partner not found.' });

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided.' });
    }

    // delete previous image if any
    if (gp.profileImageKey) {
      try { await s3Delete(gp.profileImageKey); } catch (e) { /* ignore */ }
    }

    const { imageUrl, imageKey } = await s3Upload(req.file);
    gp.profileImageUrl = imageUrl;
    gp.profileImageKey = imageKey;
    await gp.save();

    res.status(200).json({ success: true, message: 'Profile photo updated.', growthpartner: gp });
  } catch (err) {
    res.status(400).json({ error: 'Could not update profile image.' });
  }
});

// Remove profile image
router.delete('/profile-image', auth, role.check(ROLES.GrowthPartner), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.growthPartner) {
      return res.status(400).json({ error: 'Growth Partner account not found.' });
    }
    const gp = await GrowthPartner.findById(user.growthPartner);
    if (!gp) return res.status(404).json({ error: 'Growth Partner not found.' });

    if (gp.profileImageKey) {
      try { await s3Delete(gp.profileImageKey); } catch (e) { /* ignore */ }
    }

    gp.profileImageUrl = '';
    gp.profileImageKey = '';
    await gp.save();

    res.status(200).json({ success: true, message: 'Profile photo removed.', growthpartner: gp });
  } catch (err) {
    res.status(400).json({ error: 'Could not remove profile image.' });
  }
});

module.exports = router;
