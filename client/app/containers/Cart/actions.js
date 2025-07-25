/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { toggleCart } from '../Navigation/actions';
import { calculateDiscountedPrice } from '../../utils/price';

// Handle Add To Cart
export const handleAddToCart = product => {
  return (dispatch, getState) => {
    const state = getState();
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS)) || [];

    const quantity = Number(state.product.productShopData.quantity);
    const inventory = state.product.storeProduct.inventory;

    // ✅ Dynamically calculate remaining available quantity
    const result = calculatePurchaseQuantity(product._id, inventory, cartItems);

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation({ quantity }, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    // Calculate discounted price for cart
    const effectivePrice = product.discount > 0
      ? calculateDiscountedPrice(product.price, product.discount)
      : product.price;

    product.quantity = quantity;
    product.effectivePrice = effectivePrice; // Store the discounted price
    product.totalPrice = parseFloat((quantity * effectivePrice).toFixed(2));

    dispatch({ type: RESET_PRODUCT_SHOP });
    dispatch({ type: ADD_TO_CART, payload: product });

    // ✅ Merge product into cart without duplicating
    const index = cartItems.findIndex(item => item._id === product._id);
    if (index > -1) {
      cartItems[index].quantity += quantity;
      cartItems[index].totalPrice = parseFloat((cartItems[index].quantity * effectivePrice).toFixed(2));
    } else {
      cartItems.push(product);
    }

    localStorage.setItem(CART_ITEMS, JSON.stringify(cartItems));

    dispatch(calculateCartTotal());
    dispatch(toggleCart());
  };
};


// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return (dispatch, getState) => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    const newCartItems = cartItems.filter(item => item._id !== product._id);
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch({
      type: REMOVE_FROM_CART,
      payload: product
    });
    dispatch(calculateCartTotal());
    // dispatch(toggleCart());
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      // Use effective price (discounted price) if available, otherwise use regular price
      const itemPrice = item.effectivePrice || (item.discount > 0
        ? calculateDiscountedPrice(item.price, item.discount)
        : item.price);
      total += itemPrice * item.quantity;
    });

    total = parseFloat(total.toFixed(2));
    localStorage.setItem(CART_TOTAL, total);
    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from local storage
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
    cartTotal: localStorage.getItem(CART_TOTAL),
    cartId: localStorage.getItem(CART_ID)
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
      dispatch(calculateCartTotal());
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `Please Login to proceed to checkout`,
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(toggleCart());
    dispatch(push('/login'));
    dispatch(success(successfulOptions));
  };
};

// Continue shopping use case
export const handleShopping = () => {
  return (dispatch, getState) => {
    dispatch(push('/shop'));
    dispatch(toggleCart());
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`${API_URL}/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
    localStorage.removeItem(CART_ID);

    dispatch({
      type: CLEAR_CART
    });
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    // Include effective price (discounted price) for server-side calculations
    newItem.effectivePrice = item.effectivePrice || (item.discount > 0
      ? calculateDiscountedPrice(item.price, item.discount)
      : item.price);
    newItem.taxable = item.taxable;
    newItem.product = item._id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = (productId, inventory, cartItems) => {
  const existingInCart = cartItems.find(item => item._id === productId);
  const cartQty = existingInCart ? existingInCart.quantity : 0;

  const availableQty = inventory - cartQty;
  return availableQty > 0 ? availableQty : 0;
};



// /*
//  *
//  * Cart actions
//  *
//  */

// import { push } from 'connected-react-router';
// import { success } from 'react-notification-system-redux';
// import axios from 'axios';

// import {
//   HANDLE_CART,
//   ADD_TO_CART,
//   REMOVE_FROM_CART,
//   HANDLE_CART_TOTAL,
//   SET_CART_ID,
//   CLEAR_CART
// } from './constants';

// import {
//   SET_PRODUCT_SHOP_FORM_ERRORS,
//   RESET_PRODUCT_SHOP
// } from '../Product/constants';

// import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
// import handleError from '../../utils/error';
// import { allFieldsValidation } from '../../utils/validation';
// import { toggleCart } from '../Navigation/actions';

// // Handle Add To Cart
// export const handleAddToCart = product => {
//   return (dispatch, getState) => {
//     product.quantity = Number(getState().product.productShopData.quantity);
//     product.totalPrice = product.quantity * product.price;
//     product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
//     const inventory = getState().product.storeProduct.inventory;

//     const result = calculatePurchaseQuantity(inventory);
   


//     const rules = {
//       quantity: `min:1|max:${result}`
//     };

//     const { isValid, errors } = allFieldsValidation(product, rules, {
//       'min.quantity': 'Quantity must be at least 1.',
//       'max.quantity': `Quantity may not be greater than ${result}.`
//     });
   


    

//     if (!isValid) {
//       return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
//     }

//     dispatch({
//       type: RESET_PRODUCT_SHOP
//     });

//     dispatch({
//       type: ADD_TO_CART,
//       payload: product
//     });

//     const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
//     let newCartItems = [];
//     if (cartItems) {
//       newCartItems = [...cartItems, product];
//     } else {
//       newCartItems.push(product);
//     }
//     localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

//     dispatch(calculateCartTotal());
//     dispatch(toggleCart());
//   };
// };

// // Handle Remove From Cart
// export const handleRemoveFromCart = product => {
//   return (dispatch, getState) => {
//     const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
//     const newCartItems = cartItems.filter(item => item._id !== product._id);
//     localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

//     dispatch({
//       type: REMOVE_FROM_CART,
//       payload: product
//     });
//     dispatch(calculateCartTotal());
//     // dispatch(toggleCart());
//   };
// };

// export const calculateCartTotal = () => {
//   return (dispatch, getState) => {
//     const cartItems = getState().cart.cartItems;

//     let total = 0;

//     cartItems.map(item => {
//       total += item.price * item.quantity;
//     });

//     total = parseFloat(total.toFixed(2));
//     localStorage.setItem(CART_TOTAL, total);
//     dispatch({
//       type: HANDLE_CART_TOTAL,
//       payload: total
//     });
//   };
// };

// // set cart store from local storage
// export const handleCart = () => {
//   const cart = {
//     cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
//     cartTotal: localStorage.getItem(CART_TOTAL),
//     cartId: localStorage.getItem(CART_ID)
//   };

//   return (dispatch, getState) => {
//     if (cart.cartItems != undefined) {
//       dispatch({
//         type: HANDLE_CART,
//         payload: cart
//       });
//       dispatch(calculateCartTotal());
//     }
//   };
// };

// export const handleCheckout = () => {
//   return (dispatch, getState) => {
//     const successfulOptions = {
//       title: `Please Login to proceed to checkout`,
//       position: 'tr',
//       autoDismiss: 1
//     };

//     dispatch(toggleCart());
//     dispatch(push('/login'));
//     dispatch(success(successfulOptions));
//   };
// };

// // Continue shopping use case
// export const handleShopping = () => {
//   return (dispatch, getState) => {
//     dispatch(push('/shop'));
//     dispatch(toggleCart());
//   };
// };

// // create cart id api
// export const getCartId = () => {
//   return async (dispatch, getState) => {
//     try {
//       const cartId = localStorage.getItem(CART_ID);
//       const cartItems = getState().cart.cartItems;
//       const products = getCartItems(cartItems);

//       // create cart id if there is no one
//       if (!cartId) {
//         const response = await axios.post(`${API_URL}/cart/add`, { products });

//         dispatch(setCartId(response.data.cartId));
//       }
//     } catch (error) {
//       handleError(error, dispatch);
//     }
//   };
// };

// export const setCartId = cartId => {
//   return (dispatch, getState) => {
//     localStorage.setItem(CART_ID, cartId);
//     dispatch({
//       type: SET_CART_ID,
//       payload: cartId
//     });
//   };
// };

// export const clearCart = () => {
//   return (dispatch, getState) => {
//     localStorage.removeItem(CART_ITEMS);
//     localStorage.removeItem(CART_TOTAL);
//     localStorage.removeItem(CART_ID);

//     dispatch({
//       type: CLEAR_CART
//     });
//   };
// };

// const getCartItems = cartItems => {
//   const newCartItems = [];
//   cartItems.map(item => {
//     const newItem = {};
//     newItem.quantity = item.quantity;
//     newItem.price = item.price;
//     newItem.taxable = item.taxable;
//     newItem.product = item._id;
//     newCartItems.push(newItem);
//   });

//   return newCartItems;
// };

// const calculatePurchaseQuantity = inventory => {
//   if (inventory <= 25) {
//     return 1;
//   } else if (inventory > 25 && inventory <= 100) {
//     return 5;
//   } else if (inventory > 100 && inventory < 500) {
//     return 25;
//   } else {
//     return 50;
//   }
// };