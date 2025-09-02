const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Models & Helpers
const { MANUFACTURER_STATUS, ROLES } = require('../../constants');
const Manufacturer = require('../../models/manufacturer');
const User = require('../../models/user');
const Brand = require('../../models/brand');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const mailgun = require('../../services/mailgun');

// Public: Add manufacturer (no auth)
router.post('/public/add', async (req, res) => {
  try {
    const { name, business, phoneNumber, email, brandName, pinCode, city, state } = req.body;

    if (!name || !email || !phoneNumber || !business) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, phoneNumber, business.'
      });
    }

    const existing = await Manufacturer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'That email address is already registered.' });
    }

    const payload = { name, email, business, phoneNumber, brandName, pinCode, city, state };

    const doc = await new Manufacturer(payload).save();

    void mailgun.sendEmail(email, 'manufacturer-application');

    return res.status(200).json({
      success: true,
      message: `We received your request! We will reach you on ${phoneNumber}!`,
      manufacturer: doc
    });
  } catch (error) {
    console.error('Error creating manufacturer (public):', error);
    return res.status(500).json({ error: 'Could not process your request. Please try again.' });
  }
});

// Add manufacturer (dashboard: Admin only for now)
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { name, business, phoneNumber, email, brandName, pinCode, city, state } = req.body;

    if (!name || !email || !phoneNumber || !business) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, phoneNumber, business.'
      });
    }

    const existing = await Manufacturer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'That email address is already registered.' });
    }

    const payload = { name, email, business, phoneNumber, brandName, pinCode, city, state };

    const doc = await new Manufacturer(payload).save();

    void mailgun.sendEmail(email, 'manufacturer-application');

    return res.status(200).json({
      success: true,
      message: `We received your request! We will reach you on ${phoneNumber}!`,
      manufacturer: doc
    });
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    return res.status(500).json({ error: 'Could not process your request. Please try again.' });
  }
});

// List manufacturers (Admin + Manufacturer)
router.get('/', auth, role.check(ROLES.Admin, ROLES.Manufacturer), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const manufacturers = await Manufacturer.find({})
      .populate('brand')
      .sort('-created')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Manufacturer.countDocuments({});

    res.status(200).json({
      manufacturers,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Enable/Disable manufacturer
router.put('/:id/active', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    const update = req.body.manufacturer;

    const manufacturerDoc = await Manufacturer.findOneAndUpdate({ _id: manufacturerId }, update, { new: true });

    if (!update.isActive) {
      await deactivateBrand(manufacturerId);
      await mailgun.sendEmail(manufacturerDoc.email, 'manufacturer-deactivate-account');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Approve manufacturer
router.put('/approve/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    const update = { status: MANUFACTURER_STATUS.Approved, isActive: true };

    const manufacturerDoc = await Manufacturer.findOneAndUpdate({ _id: manufacturerId }, update, { new: true });

    await createManufacturerUser(
      manufacturerDoc.email,
      manufacturerDoc.name,
      manufacturerId,
      req.headers.host
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Reject manufacturer
router.put('/reject/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    const update = { status: MANUFACTURER_STATUS.Rejected };

    await Manufacturer.findOneAndUpdate({ _id: manufacturerId }, update, { new: true });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Delete manufacturer
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    await deactivateBrand(manufacturerId);
    const manufacturer = await Manufacturer.deleteOne({ _id: manufacturerId });

    res.status(200).json({ success: true, message: 'Manufacturer has been deleted successfully!', manufacturer });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Manufacturer signup to set password
router.post('/signup/:token', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'You must enter your full name.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const userDoc = await User.findOne({ email, resetPasswordToken: req.params.token });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = { _id: userDoc._id };
    const update = { email, firstName, lastName, password: hash, resetPasswordToken: undefined };

    await User.findOneAndUpdate(query, update, { new: true });

    const manufacturerDoc = await Manufacturer.findOne({ email });
    await createManufacturerBrand(manufacturerDoc);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Helpers
const deactivateBrand = async manufacturerId => {
  const doc = await Manufacturer.findOne({ _id: manufacturerId }).populate('brand', '_id');
  if (!doc || !doc.brand) return;
  const brandId = doc.brand._id;
  const query = { _id: brandId };
  const update = { isActive: false };
  return await Brand.findOneAndUpdate(query, update, { new: true });
};

const createManufacturerBrand = async ({ _id, brandName, business }) => {
  const newBrand = new Brand({ name: brandName, description: business, manufacturer: _id, isActive: true });
  const brandDoc = await newBrand.save();
  const update = { brand: brandDoc._id };
  await Manufacturer.findOneAndUpdate({ _id }, update);
};

const createManufacturerUser = async (email, name, manufacturer, host) => {
  const firstName = name;
  const lastName = '';

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const query = { _id: existingUser._id };
    const update = { manufacturer, role: ROLES.Manufacturer };

    await User.findOneAndUpdate(query, update, { new: true });

    const manufacturerDoc = await Manufacturer.findOne({ email });

    await createManufacturerBrand(manufacturerDoc);

    await mailgun.sendEmail(email, 'manufacturer-welcome', null, name);

    return await User.findOneAndUpdate(query, update, { new: true });
  } else {
    const buffer = await crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    const user = new User({
      email,
      firstName,
      lastName,
      resetPasswordToken: resetToken,
      manufacturer,
      role: ROLES.Manufacturer
    });

    await mailgun.sendEmail(email, 'manufacturer-signup', host, { resetToken, email });

    return await user.save();
  }
};

module.exports = router;

