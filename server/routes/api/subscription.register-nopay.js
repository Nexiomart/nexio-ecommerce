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
        // Prevent self-referral by email match
        const normalizedRef = String(referredBy).trim();

        if (normalizedRef.startsWith('GRW-')) {
          // Resolve Growth Partner by uniqueId
          const gpRecord = await GrowthPartner.findOne({ uniqueId: normalizedRef });
          if (gpRecord) {
            if (gpRecord.email && gpRecord.email === userData.email) {
              return res.status(400).json({ error: 'Self-referral is not allowed.' });
            }
            merchantData.growthPartner = gpRecord.uniqueId;
            merchantData.referredBy = gpRecord.uniqueId;
            refName = gpRecord.name;
          }
        } else if (normalizedRef.startsWith('MER-')) {
          // Resolve Merchant by uniqueId
          const merRecord = await Merchant.findOne({ uniqueId: normalizedRef });
          if (merRecord) {
            if (merRecord.email && merRecord.email === userData.email) {
              return res.status(400).json({ error: 'Self-referral is not allowed.' });
            }
            merchantData.referredBy = merRecord.uniqueId; // growthPartner remains null
            refName = merRecord.name;
          }
        } else if (mongoose.Types.ObjectId.isValid(normalizedRef)) {
          // Dashboard flow (GP objectId)
          const gpUser = await User.findById(normalizedRef).populate('growthPartner');
          if (gpUser?.growthPartner) {
            if (gpUser.email && gpUser.email === userData.email) {
              return res.status(400).json({ error: 'Self-referral is not allowed.' });
            }
            merchantData.growthPartner = gpUser.growthPartner.uniqueId;
            merchantData.referredBy = gpUser.growthPartner.uniqueId;
          }
        }
      }
      await new Merchant(merchantData).save();
    } else if (userType === 'growthPartner') {
      const growthPartnerData = {
        ...userData,
        status: GROWTH_PARTNER_STATUS.Waiting_Approval,
        isActive: false
      };

      // Map referral for GP signups: store referrer's uniqueId (GP or Merchant) into 'referredBy'
      if (referredBy) {
        const normalizedRef = String(referredBy).trim();
        if (normalizedRef.startsWith('GRW-')) {
          growthPartnerData.referredBy = normalizedRef;
        } else if (normalizedRef.startsWith('MER-')) {
          growthPartnerData.referredBy = normalizedRef;
        } else if (mongoose.Types.ObjectId.isValid(normalizedRef)) {
          const gpUser = await User.findById(normalizedRef).populate('growthPartner');
          if (gpUser && gpUser.growthPartner) {
            growthPartnerData.referredBy = gpUser.growthPartner.uniqueId;
          }
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

