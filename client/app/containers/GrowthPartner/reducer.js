// /*
//  *
//  * Growth Partner reducer
//  *
//  */

import {
  FETCH_GROWTH_PARTNERS,
  FETCH_SEARCHED_GROWTH_PARTNERS,
  REMOVE_GROWTH_PARTNER,
  SET_ADVANCED_FILTERS,
  GROWTH_PARTNER_CHANGE,
  SET_GROWTH_PARTNER_FORM_ERRORS,
  SET_GROWTH_PARTNER_LOADING,
  SET_GROWTH_PARTNER_SUBMITTING,
  RESET_GROWTH_PARTNER,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

const initialState = {
  growthPartners: [],
  searchedGrowthPartners: [],
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  growthPartnerFormData: {
    name: '',
    email: '',
    phoneNumber: '',
    region: '',
    strategy: '',
    referralCode: ''
  },
  formErrors: {},
  signupFormData: {
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  },
  signupFormErrors: {},
  isLoading: false,
  isSubmitting: false
};

const growthPartnerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROWTH_PARTNERS:
      return {
        ...state,
        growthPartners: action.payload
      };

    case FETCH_SEARCHED_GROWTH_PARTNERS:
      return {
        ...state,
        searchedGrowthPartners: action.payload
      };

    case REMOVE_GROWTH_PARTNER:
      const index = state.growthPartners.findIndex(p => p._id === action.payload);
      return {
        ...state,
        growthPartners: [
          ...state.growthPartners.slice(0, index),
          ...state.growthPartners.slice(index + 1)
        ]
      };

    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };

    case GROWTH_PARTNER_CHANGE:
      return {
        ...state,
        growthPartnerFormData: {
          ...state.growthPartnerFormData,
          [action.payload.name]: action.payload.value
        }
      };

    case SET_GROWTH_PARTNER_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };

    case SET_GROWTH_PARTNER_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case SET_GROWTH_PARTNER_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };

    case RESET_GROWTH_PARTNER:
      return {
        ...state,
        growthPartnerFormData: {
          name: '',
          email: '',
          phoneNumber: '',
          region: '',
          strategy: '',
          referralCode: ''
        },
        formErrors: {}
      };

    case SIGNUP_CHANGE:
      return {
        ...state,
        signupFormData: {
          ...state.signupFormData,
          [action.payload.name]: action.payload.value
        }
      };

    case SET_SIGNUP_FORM_ERRORS:
      return {
        ...state,
        signupFormErrors: action.payload
      };

    case SIGNUP_RESET:
      return {
        ...state,
        signupFormData: {
          email: '',
          firstName: '',
          lastName: '',
          password: ''
        }
      };

    default:
      return state;
  }
};

export default growthPartnerReducer;
