const mongoose = require('mongoose');
const { GROWTH_PARTNER_STATUS } = require('../constants');
const { Schema } = mongoose;
const crypto = require('crypto');

// Function to generate random referral code (8 characters)
function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex');
}

// Function to generate unique ID like "GRW-XXXXXX"
function makeUniqueId(prefix = 'GRW') {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
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

  // Profile image stored on S3
  profileImageUrl: {
    type: String,
    default: ''
  },
  profileImageKey: {
    type: String,
    default: ''
  },


  // ✅ Unique public ID for growth partner (e.g., GRW-XXXXXX)
  uniqueId: {
    type: String,
    unique: true,
    index: true
  },

  // ✅ Unique referral code (8-char alphanumeric)
  referralCode: {
    type: String,
    unique: true,
    index: true
  },

  // Who referred this GP
  referredBy: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    default: GROWTH_PARTNER_STATUS.Waiting_Approval,
    enum: [
      GROWTH_PARTNER_STATUS.Waiting_Approval,
      GROWTH_PARTNER_STATUS.Rejected,
      GROWTH_PARTNER_STATUS.Approved
    ]
  },

  referredMerchants: [{
    type: Schema.Types.ObjectId,
    ref: 'Merchant'
  }],

  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    default: null
  },

  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});


// ✅ ONE pre-save hook: Handles both uniqueId and referralCode generation
GrowthPartnerSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    let id, exists;
    do {
      id = makeUniqueId('GRW');
      exists = await mongoose.models.GrowthPartner.findOne({ uniqueId: id });
    } while (exists);
    this.uniqueId = id;
  }

  if (!this.referralCode) {
    let code, exists;
    do {
      code = generateReferralCode();
      exists = await mongoose.models.GrowthPartner.findOne({ referralCode: code });
    } while (exists);
    this.referralCode = code;
  }

  next();
});

module.exports = mongoose.models.GrowthPartner || mongoose.model('GrowthPartner', GrowthPartnerSchema);

// const mongoose = require('mongoose');
// const { GROWTH_PARTNER_STATUS } = require('../constants');
// const { Schema } = mongoose;
// const crypto = require('crypto');


// // const GROWTH_PARTNER_STATUS = {
// //   Waiting_Approval: 'Waiting Approval',
// //   Rejected: 'Rejected',
// //   Approved: 'Approved'
// // };

// // Generate random referral code
// function generateReferralCode() {
//   return crypto.randomBytes(4).toString('hex'); // 8-character unique code
// }

// const GrowthPartnerSchema = new Schema({
//   name: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   phoneNumber: {
//     type: String,
//     trim: true
//   },
//   location: {
//     type: String,
//     trim: true
//   },
//   uniqueId: {
//   type: String,
//   unique: true,
//   index: true
// },
// referredBy: {
//   type: String,
//   default: null
// },

//   referralCode: {
//     type: String,
//     unique: true,
//     index: true
//   },
//   isActive: {
//     type: Boolean,
//     default: false
//   },

//   status: {
//     type: String,
//     default: GROWTH_PARTNER_STATUS.Waiting_Approval,
//     // enum: Object.values(GROWTH_PARTNER_STATUS)
//      enum: [
//        GROWTH_PARTNER_STATUS.Waiting_Approval,
//        GROWTH_PARTNER_STATUS.Rejected,
//        GROWTH_PARTNER_STATUS.Approved
//       ]
//   },
//   referredMerchants: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Merchant'
//   }],
//   brand: {
//     type: Schema.Types.ObjectId,
//     ref: 'Brand',
//     default: null
//   },

//   updated: Date,
//   created: {
//     type: Date,
//     default: Date.now
//   }
// });




// function makeUniqueId(prefix = 'GRW') {
//   return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
// }

// GrowthPartnerSchema.pre('save', async function (next) {
//   if (!this.referralCode) {
//     let code;
//     let exists;
//     do {
//       code = generateReferralCode();
//       exists = await mongoose.models.GrowthPartner.findOne({ referralCode: code });
//     } while (exists);
//     this.referralCode = code;
//   }

//   if (!this.uniqueId) {
//     let id, exists;
//     do {
//       id = makeUniqueId('GRW');
//       exists = await mongoose.models.GrowthPartner.findOne({ uniqueId: id });
//     } while (exists);
//     this.uniqueId = id;
//   }

//   next();
// });

// // Auto-generate referral code before save
// GrowthPartnerSchema.pre('save', async function (next) {
//   if (!this.referralCode) {
//     let code;
//     let exists;
//     do {
//       code = generateReferralCode();
//       exists = await mongoose.models.GrowthPartner.findOne({ referralCode: code });
//     } while (exists);
//     this.referralCode = code;
//   }
//   next();
// });

// module.exports = mongoose.model('GrowthPartner', GrowthPartnerSchema);
