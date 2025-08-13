/**
 *
 * PaymentForm
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import { API_URL } from '../../../constants';

import './style.scss';

const PaymentForm = ({ amount, onSubmit, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetState = (setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  const handleRazorpayPayment = async () => {
    safeSetState(setIsProcessing, true);

    try {
      // Step 1: Create Razorpay order on backend
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR'
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      // Step 2: Initialize Razorpay with order details
      const options = {
        key: 'rzp_test_bRho1zes8QzzpJ', // Same key as product checkout
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'MERN Store',
        description: 'Subscription Payment',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Payment verified successfully
              const paymentData = {
                transactionId: response.razorpay_payment_id,
                paymentMethod: 'razorpay',
                paymentStatus: 'completed',
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                verified: true
              };

              onSubmit(paymentData);
            } else {
              alert('Payment verification failed!');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed!');
          }
          safeSetState(setIsProcessing, false);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          address: 'MERN Store Subscription'
        },
        theme: {
          color: '#007bff'
        },
        modal: {
          ondismiss: function() {
            safeSetState(setIsProcessing, false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      safeSetState(setIsProcessing, false);
    }
  };

  return (
    <div className="payment-form">
      <div className="razorpay-payment">
        <div className="payment-info">
          <div className="payment-method-info">
            <h5>Secure Payment with Razorpay</h5>
            <p>Pay securely using Credit/Debit Cards, UPI, Net Banking, and Wallets</p>

            <div className="payment-methods-display">
              <div className="payment-method-icon">
                <i className="fa fa-credit-card"></i>
                <span>Cards</span>
              </div>
              <div className="payment-method-icon">
                <i className="fa fa-mobile"></i>
                <span>UPI</span>
              </div>
              <div className="payment-method-icon">
                <i className="fa fa-university"></i>
                <span>Net Banking</span>
              </div>
              <div className="payment-method-icon">
                <i className="fa fa-wallet"></i>
                <span>Wallets</span>
              </div>
            </div>
          </div>

          <div className="payment-summary">
            <div className="amount-to-pay">
              <h4>Amount to Pay: ₹{amount.toLocaleString()}</h4>
              <p className="security-note">
                <i className="fa fa-shield mr-2"></i>
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            color="secondary"
            onClick={onBack}
            disabled={isProcessing}
          >
            <i className="fa fa-arrow-left mr-2"></i>
            Back to Plans
          </Button>

          <Button
            type="button"
            color="primary"
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="ml-2 razorpay-btn"
          >
            {isProcessing ? (
              <>
                <i className="fa fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fa fa-credit-card mr-2"></i>
                Pay with Razorpay
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
