const crypto = require('crypto');

const Mongoose = require('mongoose');

const { MERCHANT_STATUS } = require('../constants');

const { Schema } = Mongoose;

// Merchant Schema
const MerchantSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  brandName: {
    type: String
  },
  business: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    default: null
  },
  uniqueId: {
  type: String,
  unique: true,
  index: true
},
referredBy: {
  type: String,
  default: null
},

  
  growthPartner: {
  type: String,  // ✅ change to String
  ref: 'GrowthPartner',
  default: null  // ✅ and store values like "GRW-58C96C"
},

  status: {
    type: String,
    default: MERCHANT_STATUS.Waiting_Approval,
    enum: [
      MERCHANT_STATUS.Waiting_Approval,
      MERCHANT_STATUS.Rejected,
      MERCHANT_STATUS.Approved
    ]
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

function makeUniqueId(prefix = 'MER') {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

MerchantSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    let id, exists;
    do {
      id = makeUniqueId('MER');
      exists = await Mongoose.models.Merchant.findOne({ uniqueId: id });
    } while (exists);
    this.uniqueId = id;
  }
  next();
});


module.exports = Mongoose.model('Merchant', MerchantSchema);
