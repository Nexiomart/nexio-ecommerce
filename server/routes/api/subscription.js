const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in Models
const { SubscriptionPlan, UserSubscription, Commission } = require('../../models/subscription');
const User = require('../../models/user');
const Merchant = require('../../models/merchant');
const GrowthPartner = require('../../models/growthpartner');

// Bring in constants
const { MERCHANT_STATUS, GROWTH_PARTNER_STATUS, ROLES } = require('../../constants');

// For automated payments (you can replace with actual payment gateway)
const crypto = require('crypto');

// Bring in Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// Get subscription plans by stakeholder type
router.get('/plans/:stakeholder', async (req, res) => {
  try {
    const { stakeholder } = req.params;

    const plans = await SubscriptionPlan.find({
      stakeholder: stakeholder,
      isActive: true
    }).sort({ subscriptionFeePerYear: 1 });

    res.status(200).json({
      plans
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Get all subscription plans (for admin)
router.get('/plans', auth, role.check('ROLE ADMIN'), async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ stakeholder: 1, subscriptionFeePerYear: 1 });

    res.status(200).json({
      plans
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Create subscription with user creation (for new signups)
router.post('/subscribe-with-user', async (req, res) => {
  try {
    console.log('Subscription API called with data:', {
      planId: req.body.planId,
      referredBy: req.body.referredBy,
      userType: req.body.userType,
      userData: req.body.userData ? {
        name: req.body.userData.name,
        email: req.body.userData.email,
        phoneNumber: req.body.userData.phoneNumber
      } : null,
      paymentDetails: req.body.paymentDetails ? {
        transactionId: req.body.paymentDetails.transactionId,
        paymentMethod: req.body.paymentDetails.paymentMethod,
        paymentStatus: req.body.paymentDetails.paymentStatus
      } : null
    });

    const { planId, referredBy, paymentDetails, userData, userType } = req.body;

    if (!userData || !userType) {
      console.log('Validation failed - missing userData or userType:', {
        hasUserData: !!userData,
        hasUserType: !!userType,
        userType
      });
      return res.status(400).json({
        error: 'User data and type are required.'
      });
    }

    // Get the subscription plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        error: 'Subscription plan not found.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    let user;

    if (existingUser) {
      // User exists - update their role and create merchant/growth partner request
      user = existingUser;

      // Check if user already has the requested role
      const requestedRole = userType === 'merchant' ? ROLES.Merchant : ROLES.GrowthPartner;
      if (user.role === requestedRole) {
        return res.status(400).json({
          error: `User is already a ${userType === 'merchant' ? 'merchant' : 'growth partner'}.`
        });
      }

      // Check if user already has a pending request for this role
      if (userType === 'merchant') {
        const existingMerchant = await Merchant.findOne({ email: userData.email });
        if (existingMerchant) {
          return res.status(400).json({
            error: 'You already have a pending merchant application.'
          });
        }
      } else {
        const existingGrowthPartner = await GrowthPartner.findOne({ email: userData.email });
        if (existingGrowthPartner) {
          return res.status(400).json({
            error: 'You already have a pending growth partner application.'
          });
        }
      }
    } else {
      // Create new user
      user = new User({
        email: userData.email,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        role: ROLES.Member, // Start as member, will be upgraded after approval
        provider: 'email',
        isActive: true, // User can login but role upgrade pending
        phoneNumber: userData.phoneNumber
      });

      user = await user.save();
    }

    // Create merchant or growth partner record with pending status
    if (userType === 'merchant') {
      const merchantData = {
        ...userData,
        status: MERCHANT_STATUS.Waiting_Approval,
        isActive: false
      };

      // Add referral info if referred by growth partner
      if (referredBy) {
        let growthPartner = null;

        // Try to find Growth Partner by ObjectId first (dashboard flow)
        if (mongoose.Types.ObjectId.isValid(referredBy)) {
          growthPartner = await User.findById(referredBy).populate('growthPartner');
        } else {
          // Self-registration flow: find by uniqueId
          const gpRecord = await GrowthPartner.findOne({ uniqueId: referredBy });
          if (gpRecord) {
            growthPartner = await User.findOne({
              email: gpRecord.email,
              role: ROLES.GrowthPartner
            }).populate('growthPartner');
          }
        }

        if (growthPartner && growthPartner.growthPartner) {
          merchantData.growthPartner = growthPartner.growthPartner.uniqueId;
          merchantData.referredBy = growthPartner.growthPartner.uniqueId;
        }
      }

      await new Merchant(merchantData).save();
    } else if (userType === 'growthPartner') {
      const growthPartnerData = {
        ...userData,
        status: GROWTH_PARTNER_STATUS.Waiting_Approval,
        isActive: false
      };

      await new GrowthPartner(growthPartnerData).save();
    }

    // Calculate end date (1 year from now)
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Resolve Growth Partner ObjectId if referredBy is provided
    let growthPartnerObjectId = null;
    if (referredBy) {
      if (mongoose.Types.ObjectId.isValid(referredBy)) {
        // Dashboard flow: referredBy is already an ObjectId
        growthPartnerObjectId = referredBy;
      } else {
        // Self-registration flow: referredBy is a uniqueId, need to find ObjectId
        const gpRecord = await GrowthPartner.findOne({ uniqueId: referredBy });
        if (gpRecord) {
          const gpUser = await User.findOne({
            email: gpRecord.email,
            role: ROLES.GrowthPartner
          });
          if (gpUser) {
            growthPartnerObjectId = gpUser._id;
          }
        }
      }
    }

    console.log('Growth Partner resolution:', {
      originalReferredBy: referredBy,
      resolvedObjectId: growthPartnerObjectId,
      method: mongoose.Types.ObjectId.isValid(referredBy) ? 'dashboard' : 'self-registration'
    });

    // Create subscription
    const subscription = new UserSubscription({
      user: user._id,
      subscriptionPlan: planId,
      referredBy: growthPartnerObjectId, // Always use ObjectId or null
      status: 'inactive', // Will be activated when admin approves
      endDate,
      paymentDetails: {
        ...paymentDetails,
        amountPaid: plan.subscriptionAmount,
        paymentDate: new Date()
      }
    });

    await subscription.save();

    // If referred by a growth partner, create commission record
    console.log('Commission check:', {
      originalReferredBy: referredBy,
      resolvedGrowthPartnerObjectId: growthPartnerObjectId,
      growthPartnerCommission: plan.growthPartnerCommission,
      hasReferredBy: !!growthPartnerObjectId,
      hasCommission: plan.growthPartnerCommission > 0
    });

    if (growthPartnerObjectId && plan.growthPartnerCommission > 0) {
      // Find the Growth Partner user by ObjectId
      const growthPartner = await User.findById(growthPartnerObjectId);

      console.log('Growth Partner found for commission:', {
        id: growthPartner?._id,
        role: growthPartner?.role,
        email: growthPartner?.email
      });

      if (growthPartner && growthPartner.role === ROLES.GrowthPartner) {
        const commission = new Commission({
          growthPartner: growthPartnerObjectId,
          referredUser: user._id,
          subscription: subscription._id,
          commissionAmount: plan.growthPartnerCommission,
          commissionType: 'subscription',
          status: 'pending' // Will be approved when admin approves the user
        });

        const savedCommission = await commission.save();
        console.log('Commission created successfully:', {
          id: savedCommission._id,
          amount: savedCommission.commissionAmount,
          growthPartner: savedCommission.growthPartner,
          referredUser: savedCommission.referredUser,
          referralMethod: mongoose.Types.ObjectId.isValid(referredBy) ? 'dashboard' : 'self-registration'
        });
      } else {
        console.log('Growth Partner validation failed:', {
          growthPartnerObjectId,
          exists: !!growthPartner,
          role: growthPartner?.role,
          expectedRole: ROLES.GrowthPartner
        });
      }
    } else {
      console.log('Commission creation skipped:', {
        reason: !referredBy ? 'No referredBy' : 'No commission amount',
        referredBy,
        commissionAmount: plan.growthPartnerCommission
      });
    }

    const responseMessage = existingUser
      ? `Subscription successful! Your ${userType} application is pending admin approval.`
      : 'Registration and subscription successful! Your application is pending admin approval.';

    res.status(200).json({
      success: true,
      message: responseMessage,
      subscription,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        status: 'pending',
        isExistingUser: !!existingUser
      }
    });

  } catch (error) {
    console.error('Subscription with user creation error:', error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Create subscription (for existing users)
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, referredBy, paymentDetails } = req.body;
    const userId = req.user._id;

    // Check if user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'You already have an active subscription.'
      });
    }

    // Get the subscription plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        error: 'Subscription plan not found.'
      });
    }

    // Calculate end date (1 year from now)
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Create subscription
    const subscription = new UserSubscription({
      user: userId,
      subscriptionPlan: planId,
      referredBy: referredBy || null,
      endDate,
      paymentDetails: {
        ...paymentDetails,
        amountPaid: plan.subscriptionAmount,
        paymentDate: new Date()
      }
    });

    await subscription.save();

    // If referred by a growth partner, create commission record
    if (referredBy && plan.growthPartnerCommission > 0) {
      const growthPartner = await User.findById(referredBy);
      if (growthPartner && growthPartner.role === ROLES.GrowthPartner) {
        const commission = new Commission({
          growthPartner: referredBy,
          referredUser: userId,
          subscription: subscription._id,
          commissionAmount: plan.growthPartnerCommission,
          commissionType: 'subscription'
        });

        await commission.save();
      }
    }

    // Update user role if needed
    const user = await User.findById(userId);
    if (plan.stakeholder === 'Retailers' && user.role !== 'ROLE_MERCHANT') {
      user.role = 'ROLE_MERCHANT';
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Subscription created successfully!',
      subscription
    });

  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Get user's subscription
router.get('/my-subscription', auth, async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: 'active'
    }).populate('subscriptionPlan');

    res.status(200).json({
      subscription
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Test commission creation (temporary debug endpoint)
router.post('/test-commission', auth, async (req, res) => {
  try {
    console.log('Test commission creation for user:', {
      userId: req.user._id,
      userRole: req.user.role,
      userEmail: req.user.email
    });

    // Create a test commission
    const testCommission = new Commission({
      growthPartner: req.user._id,
      referredUser: req.user._id, // Using same user for test
      subscription: null, // No subscription for test
      commissionAmount: 500,
      commissionType: 'subscription',
      status: 'pending'
    });

    const savedCommission = await testCommission.save();
    console.log('Test commission created successfully:', {
      id: savedCommission._id,
      amount: savedCommission.commissionAmount,
      growthPartner: savedCommission.growthPartner,
      status: savedCommission.status
    });

    res.status(200).json({
      success: true,
      message: 'Test commission created successfully',
      commission: savedCommission
    });
  } catch (error) {
    console.error('Test commission creation error:', error);
    res.status(400).json({
      error: 'Failed to create test commission: ' + error.message
    });
  }
});

// Get commissions for growth partner
router.get('/commissions', auth, async (req, res) => {
  try {
    console.log('Commission API called by user:', {
      userId: req.user._id,
      userRole: req.user.role,
      userEmail: req.user.email
    });

    // Check if user has permission to view commissions
    if (req.user.role !== ROLES.Admin && req.user.role !== ROLES.GrowthPartner) {
      console.log('Access denied - invalid role:', req.user.role);
      return res.status(403).json({
        error: 'Access denied. Growth Partner or Admin role required.'
      });
    }

    const query = req.user.role === ROLES.Admin ? {} : { growthPartner: req.user._id };

    console.log('Fetching commissions for user:', {
      userId: req.user._id,
      userRole: req.user.role,
      query
    });

    const commissions = await Commission.find(query)
      .populate('referredUser', 'firstName lastName email')
      .populate('growthPartner', 'firstName lastName email')
      .populate({
        path: 'subscription',
        populate: {
          path: 'subscriptionPlan',
          select: 'modelName stakeholder'
        }
      })
      .sort({ created: -1 });

    console.log('Commissions found:', {
      count: commissions.length,
      commissions: commissions.map(c => ({
        id: c._id,
        amount: c.commissionAmount,
        status: c.status,
        growthPartner: c.growthPartner?._id || c.growthPartner,
        referredUser: c.referredUser?._id || c.referredUser,
        referredUserExists: !!c.referredUser,
        referredUserName: c.referredUser ? `${c.referredUser.firstName} ${c.referredUser.lastName}` : 'null'
      }))
    });

    res.status(200).json({
      commissions
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Update commission status (admin only)
router.put('/commission/:id/status', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    console.log('Commission status update request:', {
      commissionId: req.params.id,
      userId: req.user._id,
      userRole: req.user.role,
      userEmail: req.user.email,
      requestBody: req.body
    });

    const { id } = req.params;
    const { status, notes } = req.body;

    const commission = await Commission.findById(id);
    if (!commission) {
      return res.status(404).json({
        error: 'Commission not found.'
      });
    }

    commission.status = status;
    if (notes) commission.notes = notes;
    if (status === 'paid') commission.paidDate = new Date();
    commission.updated = new Date();

    await commission.save();

    res.status(200).json({
      success: true,
      message: 'Commission status updated successfully!',
      commission
    });

  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Automated Payment Processing
router.post('/process-payment', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { growthPartnerId, amount, paymentMethod } = req.body;

    console.log('Processing automated payment:', {
      growthPartnerId,
      amount,
      paymentMethod,
      adminId: req.user._id
    });

    // Find all approved commissions for this Growth Partner
    const approvedCommissions = await Commission.find({
      growthPartner: growthPartnerId,
      status: 'approved'
    });

    if (approvedCommissions.length === 0) {
      return res.status(400).json({
        error: 'No approved commissions found for this Growth Partner.'
      });
    }

    // Calculate total approved amount
    const totalApprovedAmount = approvedCommissions.reduce(
      (total, commission) => total + commission.commissionAmount, 0
    );

    if (amount > totalApprovedAmount) {
      return res.status(400).json({
        error: `Payment amount (₹${amount}) exceeds approved commission amount (₹${totalApprovedAmount}).`
      });
    }

    // Simulate payment processing (replace with actual payment gateway integration)
    const transactionId = `TXN_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const paymentDate = new Date();

    // In a real implementation, you would integrate with:
    // - Razorpay Payouts API
    // - Bank transfer APIs
    // - UPI payment systems
    // - PayPal payouts

    // For now, we'll simulate a successful payment
    const paymentResult = await simulatePaymentGateway(growthPartnerId, amount, paymentMethod);

    if (paymentResult.success) {
      // Update commission statuses to 'paid'
      let remainingAmount = amount;
      const updatedCommissions = [];

      for (const commission of approvedCommissions) {
        if (remainingAmount <= 0) break;

        const commissionAmount = commission.commissionAmount;
        if (remainingAmount >= commissionAmount) {
          commission.status = 'paid';
          commission.paidDate = paymentDate;
          commission.notes = `Automated payment - ${paymentMethod} - TXN: ${transactionId}`;
          commission.updated = paymentDate;

          await commission.save();
          updatedCommissions.push(commission);
          remainingAmount -= commissionAmount;
        }
      }

      console.log('Payment processed successfully:', {
        transactionId,
        updatedCommissions: updatedCommissions.length,
        totalPaid: amount - remainingAmount
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully!',
        transactionId,
        paidAmount: amount - remainingAmount,
        updatedCommissions: updatedCommissions.length,
        paymentMethod,
        paymentDate
      });

    } else {
      res.status(400).json({
        error: `Payment failed: ${paymentResult.error}`
      });
    }

  } catch (error) {
    console.error('Automated payment error:', error);
    res.status(400).json({
      error: 'Payment processing failed. Please try again.'
    });
  }
});

// Bulk Payment Processing
router.post('/process-bulk-payments', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    console.log('Processing bulk payments by admin:', req.user._id);

    // Find all approved commissions
    const approvedCommissions = await Commission.find({ status: 'approved' })
      .populate('growthPartner', 'firstName lastName email');

    if (approvedCommissions.length === 0) {
      return res.status(400).json({
        error: 'No approved commissions found for bulk payment.'
      });
    }

    // Group by Growth Partner
    const commissionsByGP = {};
    approvedCommissions.forEach(commission => {
      const gpId = commission.growthPartner._id.toString();
      if (!commissionsByGP[gpId]) {
        commissionsByGP[gpId] = {
          growthPartner: commission.growthPartner,
          commissions: [],
          totalAmount: 0
        };
      }
      commissionsByGP[gpId].commissions.push(commission);
      commissionsByGP[gpId].totalAmount += commission.commissionAmount;
    });

    const paymentResults = [];
    let totalProcessed = 0;
    let totalAmount = 0;

    // Process payments for each Growth Partner
    for (const [gpId, data] of Object.entries(commissionsByGP)) {
      try {
        const transactionId = `BULK_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const paymentDate = new Date();

        // Simulate payment for this Growth Partner
        const paymentResult = await simulatePaymentGateway(gpId, data.totalAmount, 'bank_transfer');

        if (paymentResult.success) {
          // Update all commissions for this GP
          for (const commission of data.commissions) {
            commission.status = 'paid';
            commission.paidDate = paymentDate;
            commission.notes = `Bulk automated payment - TXN: ${transactionId}`;
            commission.updated = paymentDate;
            await commission.save();
          }

          paymentResults.push({
            growthPartner: data.growthPartner,
            amount: data.totalAmount,
            transactionId,
            commissionsCount: data.commissions.length
          });

          totalProcessed += data.commissions.length;
          totalAmount += data.totalAmount;
        }
      } catch (error) {
        console.error(`Failed to process payment for GP ${gpId}:`, error);
      }
    }

    console.log('Bulk payment completed:', {
      processedGPs: paymentResults.length,
      totalCommissions: totalProcessed,
      totalAmount
    });

    res.status(200).json({
      success: true,
      message: 'Bulk payment processing completed!',
      processedCount: totalProcessed,
      totalAmount,
      paymentResults
    });

  } catch (error) {
    console.error('Bulk payment error:', error);
    res.status(400).json({
      error: 'Bulk payment processing failed. Please try again.'
    });
  }
});

// Simulate Payment Gateway (replace with actual integration)
async function simulatePaymentGateway(recipientId, amount, method) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate 95% success rate
  const success = Math.random() > 0.05;

  if (success) {
    return {
      success: true,
      transactionId: `SIM_${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      amount,
      method,
      timestamp: new Date()
    };
  } else {
    return {
      success: false,
      error: 'Payment gateway temporarily unavailable'
    };
  }
}

module.exports = router;
