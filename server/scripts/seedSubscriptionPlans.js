require('dotenv').config();
const mongoose = require('mongoose');
const { SubscriptionPlan } = require('../models/subscription');

// Connect to MongoDB || 'mongodb+srv://Riyansh:Riyansh@cluster0.hqnvrfg.mongodb.net/mern_ecommerce'
mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const subscriptionPlans = [
  // Manufacturer Plans
  {
    stakeholder: 'Manufacturer',
    modelName: 'Basic',
    subscriptionFeePerYear: 4999,
    gst: 899.82,
    subscriptionAmount: 5898.82,
    growthPartnerCommission: 1500,
    isActive: true,
    features: [
      'Basic product listing',
      'Standard analytics',
      'Email support',
      'Up to 100 products'
    ],
    description: 'Perfect for small manufacturers starting their online journey'
  },
  {
    stakeholder: 'Manufacturer',
    modelName: 'Pro',
    subscriptionFeePerYear: 14999,
    gst: 2699.82,
    subscriptionAmount: 17698.82,
    growthPartnerCommission: 4500,
    isActive: true,
    features: [
      'Advanced product listing',
      'Detailed analytics',
      'Priority support',
      'Up to 500 products',
      'Custom branding',
      'API access'
    ],
    description: 'Ideal for growing manufacturers with expanding product lines'
  },
  {
    stakeholder: 'Manufacturer',
    modelName: 'Enterprise',
    subscriptionFeePerYear: 25420,
    gst: 4575.6,
    subscriptionAmount: 29995.6,
    growthPartnerCommission: 7626,
    isActive: true,
    features: [
      'Unlimited product listing',
      'Advanced analytics & reporting',
      'Dedicated account manager',
      'Unlimited products',
      'White-label solution',
      'Custom integrations',
      'Priority API access'
    ],
    description: 'Complete solution for large-scale manufacturers'
  },
  
  // Retailers Plans
  {
    stakeholder: 'Retailers',
    modelName: 'Starter',
    subscriptionFeePerYear: 1999,
    gst: 359.82,
    subscriptionAmount: 2358.82,
    growthPartnerCommission: 600,
    isActive: true,
    features: [
      'Basic storefront',
      'Up to 50 products',
      'Standard payment gateway',
      'Basic analytics',
      'Email support'
    ],
    description: 'Perfect for new retailers entering the market'
  },
  {
    stakeholder: 'Retailers',
    modelName: 'Plus',
    subscriptionFeePerYear: 4999,
    gst: 899.82,
    subscriptionAmount: 5898.82,
    growthPartnerCommission: 1500,
    isActive: true,
    features: [
      'Professional storefront',
      'Up to 200 products',
      'Multiple payment options',
      'Advanced analytics',
      'Priority support',
      'Inventory management'
    ],
    description: 'Great for established retailers looking to grow'
  },
  {
    stakeholder: 'Retailers',
    modelName: 'Growth',
    subscriptionFeePerYear: 9999,
    gst: 1799.82,
    subscriptionAmount: 11798.82,
    growthPartnerCommission: 3000,
    isActive: true,
    features: [
      'Premium storefront',
      'Unlimited products',
      'Advanced payment gateway',
      'Comprehensive analytics',
      'Dedicated support',
      'Advanced inventory management',
      'Marketing tools',
      'Multi-location support'
    ],
    description: 'Complete solution for rapidly growing retailers'
  },
  
  // Other Growth Partner Plans
  {
    stakeholder: 'Other Growth Partner',
    modelName: 'Certified',
    subscriptionFeePerYear: 2540,
    gst: 457.2,
    subscriptionAmount: 2997.2,
    growthPartnerCommission: 762,
    isActive: true,
    features: [
      'Growth partner dashboard',
      'Commission tracking',
      'Referral management',
      'Performance analytics',
      'Training resources',
      'Marketing materials'
    ],
    description: 'Certification program for growth partners'
  }
];

async function seedSubscriptionPlans() {
  try {
    // Clear existing plans
    await SubscriptionPlan.deleteMany({});
    console.log('Cleared existing subscription plans');

    // Insert new plans
    const createdPlans = await SubscriptionPlan.insertMany(subscriptionPlans);
    console.log(`Created ${createdPlans.length} subscription plans`);

    // Display created plans
    createdPlans.forEach(plan => {
      console.log(`- ${plan.stakeholder} ${plan.modelName}: ₹${plan.subscriptionAmount} (Commission: ₹${plan.growthPartnerCommission})`);
    });

    console.log('Subscription plans seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    process.exit(1);
  }
}

seedSubscriptionPlans();



// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "index.js",
//       "use": "@vercel/node"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/(.*)",
//       "dest": "/"
//     }
//   ]
// }
