// // /**
// //  *
// //  * CartSummary
// //  *
// //  */

// import React from 'react';

// import { Container, Row, Col } from 'reactstrap';

// const CartSummary = props => {
//   const { cartTotal } = props;

//   return (
//     <div className='cart-summary'>
//       <Container>
//         <Row className='mb-2 summary-item'>
//           <Col xs='9'>
//             <p className='summary-label'>Shippling</p>
//           </Col>
//           <Col xs='3' className='text-right'>
//             <p className='summary-value'>₹ 0</p>
//           </Col>
//         </Row>
//         <Row className='mb-2 summary-item'>
//           <Col xs='9'>
//             <p className='summary-label'>Total</p>
//           </Col>
//           <Col xs='3' className='text-right'>
//             <p className='summary-value'>₹ {cartTotal}</p>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default CartSummary;
/**
 *
 * CartSummary
 *
 */
/**
 *
 * CartSummary
 *
 */

import React from 'react';
import { Col } from 'reactstrap';

const TAX_RATE = 5; // You can also import this from backend config if needed

const CartSummary = ({ cartItems, cartTotal }) => {
  const subtotal = parseFloat(cartTotal) || 0;

  // Calculate estimated sales tax (based on items marked as taxable)
  const estimatedTax = cartItems.reduce((total, item) => {
    if (item.taxable) {
      return total + item.price * item.quantity * (TAX_RATE / 100);
    }
    return total;
  }, 0);

  const shipping = 0; // hardcoded
  const grandTotal = subtotal + estimatedTax + shipping;

  return (
    <Col className='cart-summary pt-3'>
      <h2>Cart Summary</h2>

      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Subtotal</p>
        <p className='summary-value ml-auto'>₹ {subtotal.toFixed(2)}</p>
      </div>

      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Est. Sales Tax</p>
        <p className='summary-value ml-auto'>₹ {estimatedTax.toFixed(2)}</p>
      </div>

      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Shipping</p>
        <p className='summary-value ml-auto'>₹ {shipping.toFixed(2)}</p>
      </div>

      <hr />

      <div className='d-flex align-items-center summary-item font-weight-bold'>
        <p className='summary-label'>Total</p>
        <p className='summary-value ml-auto'>₹ {grandTotal.toFixed(2)}</p>
      </div>
    </Col>
  );
};

export default CartSummary;
