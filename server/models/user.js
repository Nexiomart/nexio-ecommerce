const crypto = require('crypto');

const Mongoose = require('mongoose');

const { ROLES, EMAIL_PROVIDER } = require('../constants');

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: () => {
      return this.provider !== 'email' ? false : true;
    }
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

  phoneNumber: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant',
    default: null
  },
  growthPartner: {
  type: Schema.Types.ObjectId,
  ref: 'GrowthPartner',
  default: null
},

  provider: {
    type: String,
    required: true,
    default: EMAIL_PROVIDER.Email
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    default: ROLES.Member,
    enum: [ROLES.Admin, ROLES.Member, ROLES.Merchant , ROLES.GrowthPartner]
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

function makeUniqueId(prefix = 'USR') {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

UserSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    let id, exists;
    do {
      id = makeUniqueId('USR');
      exists = await Mongoose.models.User.findOne({ uniqueId: id });
    } while (exists);
    this.uniqueId = id;
  }
  next();
});




module.exports = Mongoose.model('User', UserSchema);


