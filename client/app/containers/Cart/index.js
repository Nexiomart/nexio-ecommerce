/*
 *
 * Cart
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import CartList from '../../components/Store/CartList';
import CartSummary from '../../components/Store/CartSummary';
import Checkout from '../../components/Store/Checkout';
import { BagIcon, CloseIcon } from '../../components/Common/Icon';
import Button from '../../components/Common/Button';
import { API_URL } from '../../constants';

class Cart extends React.PureComponent {
  // razorpay 
  handlePayment = async () => {
  // const { cartTotal, placeOrder } = this.props;
  const { cartTotal, placeOrder, user } = this.props;

// api http://localhost:3000/api
  const res = await fetch(`${API_URL}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: cartTotal,
      currency: 'INR'
    })
  });

  const data = await res.json();

  const options = {
    key: 'rzp_test_bRho1zes8QzzpJ', // Replace with your Razorpay key
    amount: data.order.amount,
    currency: data.order.currency,
    name: 'Your Shop Name',
    description: 'Order Payment',
    order_id: data.order.id,
    handler: async function (response) {
      const verifyRes = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        await placeOrder(); // dispatches addOrder and clears cart
      } else {
        alert('Payment verification failed!');
      }
    },
    // prefill: {
    //   name: 'User Name',
    //   email: 'user@example.com',
    //   contact: '9999999999',
    // },
    prefill: {
  name: user?.name || '',
  email: user?.email || '',
  contact: user?.phone || ''
},

    theme: { color: '#F37254' }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

  render() {
    const {
      isCartOpen,
      cartItems,
      cartTotal,
      toggleCart,
      handleShopping,
      handleCheckout,
      handleRemoveFromCart,
      // placeOrder,
      authenticated,
      handlePayment
    } = this.props;

    return (
      <div className='cart'>
        <div className='cart-header'>
          {isCartOpen && (
            <Button
              borderless
              variant='empty'
              ariaLabel='close the cart'
              icon={<CloseIcon />}
              onClick={toggleCart}
            />
          )}
        </div>
        {cartItems.length > 0 ? (
          <div className='cart-body'>
            <CartList
              toggleCart={toggleCart}
              cartItems={cartItems}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          </div>
        ) : (
          <div className='empty-cart'>
            <BagIcon />
            <p>Your shopping cart is empty</p>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className='cart-checkout'>
            {/* <CartSummary cartTotal={cartTotal} /> */}
            <CartSummary cartItems={cartItems} cartTotal={cartTotal} />

            <Checkout
              handleShopping={handleShopping}
              handleCheckout={handleCheckout}
              // placeOrder={placeOrder}
              handlePayment={this.handlePayment}
              authenticated={authenticated}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isCartOpen: state.navigation.isCartOpen,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    authenticated: state.authentication.authenticated,
    user: state.account.user // ✅ Add this line

  };
};

export default connect(mapStateToProps, actions)(Cart);
