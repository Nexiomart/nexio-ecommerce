const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Debug Razorpay configuration
console.log('Razorpay Configuration:', {
  key_id: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing',
  key_secret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing'
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

  // Ensure amount is a valid number and convert to integer paise
  const amountInRupees = parseFloat(amount);
  if (isNaN(amountInRupees) || amountInRupees <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid amount. Amount must be a positive number.'
    });
  }

  const amountInPaise = Math.round(amountInRupees * 100); // Convert to paise and round to avoid floating point issues

  console.log('Payment order creation:', {
    originalAmount: amount,
    amountInRupees,
    amountInPaise,
    currency,
    receipt
  });

  const options = {
    amount: amountInPaise, // Amount in paise (smallest currency unit)
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);
    res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify payment
router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true, message: 'Payment Verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

module.exports = router;
