/*
 *
 * Product reducer
 *
 */

import {
  FETCH_PRODUCTS,
  FETCH_STORE_PRODUCTS,
  FETCH_PRODUCT,
  FETCH_STORE_PRODUCT,
  PRODUCT_CHANGE,
  PRODUCT_EDIT_CHANGE,
  PRODUCT_SHOP_CHANGE,
  SET_PRODUCT_FORM_ERRORS,
  SET_PRODUCT_FORM_EDIT_ERRORS,
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT,
  RESET_PRODUCT_SHOP,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  FETCH_PRODUCTS_SELECT,
  SET_PRODUCTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS,
  FETCH_TOP_DISCOUNTED_PRODUCTS,
  FETCH_LATEST_PRODUCTS
} from './constants';

const initialState = {
  products: [],
  storeProducts: [],
  product: {
    _id: ''
  },
  storeProduct: {},
  productsSelect: [],
  topDiscountedProducts: [],
  latestProducts: [],
  productFormData: {
    sku: '',
    name: '',
    description: '',
    quantity: 1,
    price: 1,
    discount: 0,
    image: {},
    isActive: true,
    taxable: { value: 0, label: 'No' },
    brand: {
      value: 0,
      label: 'No Options Selected'
    }
  },
  isLoading: false,
  productShopData: {
    quantity: 1
  },
  formErrors: {},
  editFormErrors: {},
  shopFormErrors: {},
  advancedFilters: {
    name: 'all',
    category: 'all',
    brand: 'all',
    min: 1,
    max: 2500,
    rating: 0,
    order: 0,
    totalPages: 1,
    currentPage: 1,
    count: 0,
    limit: 10
  }
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    case FETCH_STORE_PRODUCTS:
      return {
        ...state,
        storeProducts: action.payload
      };
    case FETCH_PRODUCT:
      return {
        ...state,
        product: action.payload,
        editFormErrors: {}
      };
    case FETCH_STORE_PRODUCT:
      return {
        ...state,
        storeProduct: action.payload,
        productShopData: {
          quantity: 1
        },
        shopFormErrors: {}
      };
    case SET_PRODUCTS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_PRODUCTS_SELECT:
      return { ...state, productsSelect: action.payload };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case REMOVE_PRODUCT:
      const index = state.products.findIndex(b => b._id === action.payload);
      return {
        ...state,
        products: [
          ...state.products.slice(0, index),
          ...state.products.slice(index + 1)
        ]
      };
    case PRODUCT_CHANGE:
      return {
        ...state,
        productFormData: {
          ...state.productFormData,
          ...action.payload
        }
      };
    case PRODUCT_EDIT_CHANGE:
      return {
        ...state,
        product: {
          ...state.product,
          ...action.payload
        }
      };
    case PRODUCT_SHOP_CHANGE:
      return {
        ...state,
        productShopData: {
          ...state.productShopData,
          ...action.payload
        }
      };
    case SET_PRODUCT_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_PRODUCT_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case SET_PRODUCT_SHOP_FORM_ERRORS:
      return {
        ...state,
        shopFormErrors: action.payload
      };
    case RESET_PRODUCT:
      return {
        ...state,
        productFormData: {
          sku: '',
          name: '',
          description: '',
          quantity: 1,
          price: 1,
          image: {},
          isActive: true,
          taxable: { value: 0, label: 'No' },
          brand: {
            value: 0,
            label: 'No Options Selected'
          }
        },
        product: {
          _id: ''
        },
        formErrors: {}
      };
    case RESET_PRODUCT_SHOP:
      return {
        ...state,
        productShopData: {
          quantity: 1
        },
        shopFormErrors: {}
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case RESET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          name: 'all',
          category: 'all',
          brand: 'all',
          min: 1,
          max: 2500,
          rating: 0,
          order: 0,
          totalPages: 1,
          currentPage: 1,
          count: 0,
          limit: 10
        }
      };
    case FETCH_TOP_DISCOUNTED_PRODUCTS:
      return {
        ...state,
        topDiscountedProducts: action.payload
      };
    case FETCH_LATEST_PRODUCTS:
      return {
        ...state,
        latestProducts: action.payload
      };
    default:
      return state;
  }
};

export default productReducer;
