/*
 *
 * Subscription actions
 *
 */

import axios from 'axios';
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

import { API_URL } from '../../constants';
import handleError from '../../utils/error';
import { success } from 'react-notification-system-redux';

// Fetch subscription plans by stakeholder type
export const fetchSubscriptionPlans = (stakeholder) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoading(true));

      const response = await axios.get(`${API_URL}/subscription/plans/${stakeholder}`);

      dispatch({
        type: FETCH_SUBSCRIPTION_PLANS,
        payload: response.data.plans
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };
};

// Fetch user's current subscription
export const fetchUserSubscription = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoading(true));

      const response = await axios.get(`${API_URL}/subscription/my-subscription`);

      dispatch({
        type: FETCH_USER_SUBSCRIPTION,
        payload: response.data.subscription
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };
};

// Create subscription with user creation
export const createSubscription = (subscriptionData) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoading(true));

      // Get pending user data from state
      const state = getState();
      const pendingMerchantData = state.merchant.pendingMerchantData;
      const pendingGrowthPartnerData = state.growthPartner.pendingGrowthPartnerData;
      const isAuthenticated = state.authentication.authenticated;
      const currentUser = state.account.user;

      // Determine user type and data
      let userData = null;
      let userType = null;

      if (pendingMerchantData) {
        userData = pendingMerchantData;
        userType = 'merchant';
      } else if (pendingGrowthPartnerData) {
        userData = pendingGrowthPartnerData;
        userType = 'growthPartner';
      }

      if (!userData) {
        throw new Error('No pending user data found');
      }

      // Extract referredBy from userData (set by Growth Partner when adding merchant)
      const referredBy = userData.referredBy;

      // If user is logged in and it's their own registration, use their email for consistency
      // But if a Growth Partner is adding a merchant, keep the merchant's email
      if (isAuthenticated && currentUser && userData.email === currentUser.email) {
        userData = {
          ...userData,
          email: currentUser.email
        };
      }

      // Remove referredBy from userData to avoid sending it as part of user data
      const { referredBy: _, ...cleanUserData } = userData;

      // Determine effective referral source (modal input or pending data)
      const effectiveReferredBy = subscriptionData.referredBy || referredBy || null;

      // Create subscription with user data
      const formData = new FormData();
      formData.set('planId', subscriptionData.planId);
      if (effectiveReferredBy) formData.set('referredBy', effectiveReferredBy);
      if (subscriptionData.paymentDetails) formData.set('paymentDetails', JSON.stringify(subscriptionData.paymentDetails));
      formData.set('userType', userType);
      formData.set('userData', JSON.stringify(cleanUserData));

      // Attach profile image if provided (for growth partner flow)
      if (cleanUserData.profileImage) {
        formData.set('profileImage', cleanUserData.profileImage);
      }

      const endpoint = `${API_URL}/subscription/subscribe-with-user`;
      const response = await axios.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      dispatch({
        type: CREATE_SUBSCRIPTION,
        payload: response.data.subscription
      });

      const successMessage = response.data.user?.isExistingUser
        ? 'Subscription successful! Your application is pending admin approval.'
        : 'Registration and subscription successful! Your application is pending admin approval.';

      success({
        title: response.data.message,
        message: successMessage,
        position: 'tr',
        autoDismiss: 5
      });

      dispatch(toggleSubscriptionModal(false));
      dispatch(resetSubscriptionForm());

      // Clear pending data
      if (pendingMerchantData) {
        dispatch({ type: 'CLEAR_PENDING_MERCHANT_DATA' });
      }
      if (pendingGrowthPartnerData) {
        dispatch({ type: 'CLEAR_PENDING_GROWTH_PARTNER_DATA' });
      }

    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };
};

// Fetch commissions (for growth partners)
export const fetchCommissions = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoading(true));

      const response = await axios.get(`${API_URL}/subscription/commissions`);

      dispatch({
        type: FETCH_COMMISSIONS,
        payload: response.data.commissions
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };
};

// Set loading state
export const setSubscriptionLoading = (value) => {
  return {
    type: SET_SUBSCRIPTION_LOADING,
    payload: value
  };
};

// Set form errors
export const setSubscriptionFormErrors = (errors) => {
  return {
    type: SET_SUBSCRIPTION_FORM_ERRORS,
    payload: errors
  };
};

// Reset subscription form
export const resetSubscriptionForm = () => {
  return {
    type: RESET_SUBSCRIPTION_FORM
  };
};

// Handle form changes
export const subscriptionFormChange = (name, value) => {
  return {
    type: SUBSCRIPTION_FORM_CHANGE,
    payload: { name, value }
  };
};

// Set selected plan
export const setSelectedPlan = (plan) => {
  return {
    type: SET_SELECTED_PLAN,
    payload: plan
  };
};

// Toggle subscription modal
export const toggleSubscriptionModal = (isOpen, stakeholder = null) => {
  return async (dispatch, getState) => {
    dispatch({
      type: TOGGLE_SUBSCRIPTION_MODAL,
      payload: { isOpen, stakeholder }
    });

    // Fetch plans when modal opens
    if (isOpen && stakeholder) {
      dispatch(fetchSubscriptionPlans(stakeholder));
    }
  };
};

// Register without payment (no subscription created)
export const registerWithoutPayment = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoading(true));

      const state = getState();
      const pendingMerchantData = state.merchant.pendingMerchantData;
      const pendingGrowthPartnerData = state.growthPartner.pendingGrowthPartnerData;

      let userData = null;
      let userType = null;
      let referredBy = null;

      if (pendingMerchantData) {
        userData = pendingMerchantData;
        userType = 'merchant';
        referredBy = pendingMerchantData.referredBy || null;
      } else if (pendingGrowthPartnerData) {
        userData = pendingGrowthPartnerData;
        userType = 'growthPartner';
        referredBy = pendingGrowthPartnerData.referredBy || null;
      }

      if (!userData || !userType) {
        throw new Error('No pending user data found. Please fill the form first.');
      }

      const { referredBy: _, profileImage, ...cleanUserData } = userData;

      const formData = new FormData();
      if (referredBy) formData.set('referredBy', referredBy);
      formData.set('userType', userType);
      formData.set('userData', JSON.stringify(cleanUserData));
      if (profileImage) formData.set('profileImage', profileImage);

      const endpoint = `${API_URL}/subscription/register-with-user`;
      await axios.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      success({
        title: 'Submitted for approval',
        message: 'We received your application. You will be notified after admin review.',
        position: 'tr',
        autoDismiss: 6
      });

      dispatch(toggleSubscriptionModal(false));
      dispatch(resetSubscriptionForm());

      if (pendingMerchantData) {
        dispatch({ type: 'CLEAR_PENDING_MERCHANT_DATA' });
      }
      if (pendingGrowthPartnerData) {
        dispatch({ type: 'CLEAR_PENDING_GROWTH_PARTNER_DATA' });
      }

    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };
};

