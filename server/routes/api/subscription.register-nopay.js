// Extracted: Register merchant or growth partner WITHOUT payment (no subscription created)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const { MERCHANT_STATUS, GROWTH_PARTNER_STATUS, ROLES } = require('../../constants');
const User = require('../../models/user');
const Merchant = require('../../models/merchant');
const GrowthPartner = require('../../models/growthpartner');
const { s3Upload } = require('../../utils/storage');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/subscription/register-with-user', upload.single('profileImage'), async (req, res) => {
  try {
    const parsedUserData = typeof req.body.userData === 'string' ? JSON.parse(req.body.userData) : req.body.userData;
    const { referredBy, userType } = req.body;
    const userData = parsedUserData;
    const profileImage = req.file;

    if (!userData || !userType) {
      return res.status(400).json({ error: 'User data and type are required.' });
    }

    let user = await User.findOne({ email: userData.email });

    if (user) {
      const requestedRole = userType === 'merchant' ? ROLES.Merchant : ROLES.GrowthPartner;
      if (user.role === requestedRole) {
        return res.status(400).json({ error: `User is already a ${userType}.` });
      }
      if (userType === 'merchant') {
        const existingMerchant = await Merchant.findOne({ email: userData.email });
        if (existingMerchant) return res.status(400).json({ error: 'You already have a pending merchant application.' });
      } else {
        const existingGrowthPartner = await GrowthPartner.findOne({ email: userData.email });
        if (existingGrowthPartner) return res.status(400).json({ error: 'You already have a pending growth partner application.' });
      }
    } else {
      user = await new User({
        email: userData.email,
        firstName: userData.name?.split(' ')[0] || userData.name,
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        role: ROLES.Member,
        provider: 'email',
        isActive: true,
        phoneNumber: userData.phoneNumber
      }).save();
    }

    if (userType === 'merchant') {
      const merchantData = {
        ...userData,
        status: MERCHANT_STATUS.Waiting_Approval,
        isActive: false
      };
      if (referredBy) {
        let gpUser = null;
        if (mongoose.Types.ObjectId.isValid(referredBy)) {
          gpUser = await User.findById(referredBy).populate('growthPartner');
        } else {
          const gpRecord = await GrowthPartner.findOne({ uniqueId: referredBy });
          if (gpRecord) {
            gpUser = await User.findOne({ email: gpRecord.email, role: ROLES.GrowthPartner }).populate('growthPartner');
          }
        }
        if (gpUser?.growthPartner) {
          merchantData.growthPartner = gpUser.growthPartner.uniqueId;
          merchantData.referredBy = gpUser.growthPartner.uniqueId;
        }
      }
      await new Merchant(merchantData).save();
    } else if (userType === 'growthPartner') {
      const growthPartnerData = {
        ...userData,
        status: GROWTH_PARTNER_STATUS.Waiting_Approval,
        isActive: false
      };

      // Map referral for GP signups: store referrer's GP uniqueId into 'referredBy'
      if (referredBy) {
        if (mongoose.Types.ObjectId.isValid(referredBy)) {
          const gpUser = await User.findById(referredBy).populate('growthPartner');
          if (gpUser && gpUser.growthPartner) {
            growthPartnerData.referredBy = gpUser.growthPartner.uniqueId;
          }
        } else {
          growthPartnerData.referredBy = referredBy;
        }
      }

      if (profileImage) {
        const { imageUrl, imageKey } = await s3Upload(profileImage);
        growthPartnerData.profileImageUrl = imageUrl;
        growthPartnerData.profileImageKey = imageKey;
      }
      await new GrowthPartner(growthPartnerData).save();
    }

    return res.status(200).json({
      success: true,
      message: 'Registration submitted. Your application is pending admin approval.',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('register-with-user error:', error);
    return res.status(400).json({ error: 'Could not submit registration.' });
  }
});

module.exports = router;

