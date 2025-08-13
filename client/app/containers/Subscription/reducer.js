/*
 *
 * Subscription reducer
 *
 */

import {
  FETCH_SUBSCRIPTION_PLANS,
  FETCH_USER_SUBSCRIPTION,
  CREATE_SUBSCRIPTION,
  FETCH_COMMISSIONS,
  SET_SUBSCRIPTION_LOADING,
  SET_SUBSCRIPTION_FORM_ERRORS,
  RESET_SUBSCRIPTION_FORM,
  SUBSCRIPTION_FORM_CHANGE,
  SET_SELECTED_PLAN,
  TOGGLE_SUBSCRIPTION_MODAL
} from './constants';

const initialState = {
  subscriptionPlans: [],
  userSubscription: null,
  commissions: [],
  selectedPlan: null,
  isLoading: false,
  isModalOpen: false,
  modalStakeholder: null,
  subscriptionFormData: {
    planId: '',
    referredBy: '',
    paymentDetails: {
      transactionId: '',
      paymentMethod: 'card',
      paymentStatus: 'pending'
    }
  },
  formErrors: {}
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBSCRIPTION_PLANS:
      return {
        ...state,
        subscriptionPlans: action.payload
      };

    case FETCH_USER_SUBSCRIPTION:
      return {
        ...state,
        userSubscription: action.payload
      };

    case CREATE_SUBSCRIPTION:
      return {
        ...state,
        userSubscription: action.payload
      };

    case FETCH_COMMISSIONS:
      return {
        ...state,
        commissions: action.payload
      };

    case SET_SUBSCRIPTION_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case SET_SUBSCRIPTION_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };

    case RESET_SUBSCRIPTION_FORM:
      return {
        ...state,
        subscriptionFormData: initialState.subscriptionFormData,
        formErrors: {},
        selectedPlan: null
      };

    case SUBSCRIPTION_FORM_CHANGE:
      return {
        ...state,
        subscriptionFormData: {
          ...state.subscriptionFormData,
          [action.payload.name]: action.payload.value
        }
      };

    case SET_SELECTED_PLAN:
      return {
        ...state,
        selectedPlan: action.payload,
        subscriptionFormData: {
          ...state.subscriptionFormData,
          planId: action.payload ? action.payload._id : ''
        }
      };

    case TOGGLE_SUBSCRIPTION_MODAL:
      return {
        ...state,
        isModalOpen: action.payload.isOpen,
        modalStakeholder: action.payload.stakeholder,
        // Reset form when closing modal
        ...(action.payload.isOpen === false && {
          subscriptionFormData: initialState.subscriptionFormData,
          formErrors: {},
          selectedPlan: null,
          subscriptionPlans: []
        })
      };

    default:
      return state;
  }
};

export default subscriptionReducer;
