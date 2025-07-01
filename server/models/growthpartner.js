const mongoose = require('mongoose');
const { GROWTH_PARTNER_STATUS } = require('../constants');
const { Schema } = mongoose;
const crypto = require('crypto');


// const GROWTH_PARTNER_STATUS = {
//   Waiting_Approval: 'Waiting Approval',
//   Rejected: 'Rejected',
//   Approved: 'Approved'
// };

// Generate random referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex'); // 8-character unique code
}

const GrowthPartnerSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  referralCode: {
    type: String,
    unique: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
   
  status: {
    type: String,
    default: GROWTH_PARTNER_STATUS.Waiting_Approval,
    // enum: Object.values(GROWTH_PARTNER_STATUS)
     enum: [
       GROWTH_PARTNER_STATUS.Waiting_Approval,
       GROWTH_PARTNER_STATUS.Rejected,
       GROWTH_PARTNER_STATUS.Approved
      ]
  },
  // referredMerchants: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Merchant'
  // }],
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate referral code before save
GrowthPartnerSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    let code;
    let exists;
    do {
      code = generateReferralCode();
      exists = await mongoose.models.GrowthPartner.findOne({ referralCode: code });
    } while (exists);
    this.referralCode = code;
  }
  next();
});

module.exports = mongoose.model('GrowthPartner', GrowthPartnerSchema);
