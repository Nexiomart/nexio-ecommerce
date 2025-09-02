/* Manufacturer reducer */

import {
  FETCH_MANUFACTURERS,
  REMOVE_MANUFACTURER,
  SET_ADVANCED_FILTERS,
  MANUFACTURER_CHANGE,
  SET_MANUFACTURER_FORM_ERRORS,
  SET_MANUFACTURERS_LOADING,
  SET_MANUFACTURERS_SUBMITTING,
  RESET_MANUFACTURER,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

const initialState = {
  manufacturers: [],
  searchedManufacturers: [],
  advancedFilters: { totalPages: 1, currentPage: 1, count: 0 },
  manufacturerFormData: {
    name: '',
    email: '',
    phoneNumber: '',
    brandName: '',
    business: '',
    pinCode: '',
    city: '',
    state: ''
  },
  formErrors: {},
  signupFormData: { email: '', firstName: '', lastName: '', password: '' },
  signupFormErrors: {},
  isLoading: false,
  isSubmitting: false,
  pendingManufacturerData: null
};

const manufacturerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MANUFACTURERS:
      return { ...state, manufacturers: action.payload };
    case SET_ADVANCED_FILTERS:
      return { ...state, advancedFilters: { ...state.advancedFilters, ...action.payload } };
    case MANUFACTURER_CHANGE:
      return { ...state, manufacturerFormData: { ...state.manufacturerFormData, ...action.payload } };
    case SET_MANUFACTURER_FORM_ERRORS:
      return { ...state, formErrors: action.payload };
    case SET_MANUFACTURERS_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_MANUFACTURERS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case RESET_MANUFACTURER:
      return {
        ...state,
        manufacturerFormData: { name: '', email: '', phoneNumber: '', brandName: '', business: '', pinCode: '', city: '', state: '' },
        formErrors: {}
      };
    case SIGNUP_CHANGE:
      return { ...state, signupFormData: { ...state.signupFormData, ...action.payload } };
    case SET_SIGNUP_FORM_ERRORS:
      return { ...state, signupFormErrors: action.payload };
    case SIGNUP_RESET:
      return { ...state, signupFormData: { email: '', firstName: '', lastName: '', password: '' } };
    case 'SET_PENDING_MANUFACTURER_DATA':
      return { ...state, pendingManufacturerData: action.payload };
    case 'CLEAR_PENDING_MANUFACTURER_DATA':
      return { ...state, pendingManufacturerData: null, manufacturerFormData: { name: '', email: '', phoneNumber: '', brandName: '', business: '', pinCode: '', city: '', state: '' } };
    default:
      return state;
  }
};

export default manufacturerReducer;

