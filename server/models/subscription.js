const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Subscription Plans Schema
const SubscriptionPlanSchema = new Schema({
  stakeholder: {
    type: String,
    required: true,
    enum: ['Manufacturer', 'Retailers', 'Other Growth Partner']
  },
  modelName: {
    type: String,
    required: true
  },
  subscriptionFeePerYear: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  subscriptionAmount: {
    type: Number,
    required: true
  },
  growthPartnerCommission: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// User Subscription Schema
const UserSubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionPlan: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null // Growth Partner who referred this user
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentMethod: String,
    amountPaid: Number,
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// Commission Schema
const CommissionSchema = new Schema({
  growthPartner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'UserSubscription',
    required: true
  },
  commissionAmount: {
    type: Number,
    required: true
  },
  commissionType: {
    type: String,
    enum: ['subscription', 'sale', 'renewal'],
    default: 'subscription'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'cancelled'],
    default: 'pending'
  },
  paidDate: {
    type: Date
  },
  notes: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
SubscriptionPlanSchema.index({ stakeholder: 1, isActive: 1 });
UserSubscriptionSchema.index({ user: 1, status: 1 });
UserSubscriptionSchema.index({ referredBy: 1 });
CommissionSchema.index({ growthPartner: 1, status: 1 });

module.exports = {
  SubscriptionPlan: Mongoose.model('SubscriptionPlan', SubscriptionPlanSchema),
  UserSubscription: Mongoose.model('UserSubscription', UserSubscriptionSchema),
  Commission: Mongoose.model('Commission', CommissionSchema)
};
