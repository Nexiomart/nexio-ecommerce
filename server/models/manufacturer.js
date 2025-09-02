const crypto = require('crypto');

const Mongoose = require('mongoose');

const { MANUFACTURER_STATUS } = require('../constants');

const { Schema } = Mongoose;

// Manufacturer Schema
const ManufacturerSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String },
  phoneNumber: { type: String },
  brandName: { type: String },
  business: { type: String, trim: true },
  isActive: { type: Boolean, default: false },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
  uniqueId: { type: String, unique: true, index: true },
  referredBy: { type: String, default: null }, // reserved for future GP referral
  pinCode: { type: String, trim: true, maxlength: 6, index: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  status: {
    type: String,
    default: MANUFACTURER_STATUS.Waiting_Approval,
    enum: [
      MANUFACTURER_STATUS.Waiting_Approval,
      MANUFACTURER_STATUS.Rejected,
      MANUFACTURER_STATUS.Approved
    ]
  },
  updated: Date,
  created: { type: Date, default: Date.now }
});

function makeUniqueId(prefix = 'MFR') {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

ManufacturerSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    let id, exists;
    do {
      id = makeUniqueId('MFR');
      exists = await Mongoose.models.Manufacturer.findOne({ uniqueId: id });
    } while (exists);
    this.uniqueId = id;
  }
  next();
});

module.exports = Mongoose.model('Manufacturer', ManufacturerSchema);

