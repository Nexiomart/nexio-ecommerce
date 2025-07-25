/*
 *
 * Merchant actions
 *
 */

import { push, goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_MERCHANTS,
  REMOVE_MERCHANT,
  SET_ADVANCED_FILTERS,
  FETCH_SEARCHED_MERCHANTS,
  MERCHANT_CHANGE,
  SET_MERCHANT_FORM_ERRORS,
  SET_MERCHANTS_LOADING,
  SET_MERCHANTS_SUBMITTING,
  RESET_MERCHANT,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { signOut } from '../Login/actions';
import { API_URL } from '../../constants';

export const merchantChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: MERCHANT_CHANGE,
    payload: formData
  };
};

export const merchantSignupChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SIGNUP_CHANGE,
    payload: formData
  };
};

export const setMerchantLoading = value => {
  return {
    type: SET_MERCHANTS_LOADING,
    payload: value
  };
};

export const setMerchantSubmitting = value => {
  return {
    type: SET_MERCHANTS_SUBMITTING,
    payload: value
  };
};

// add merchant api
export const addMerchant = (isBack = false) => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        brandName: 'required',
        business: 'required|min:10',
        // pinCode: ['required', `regex:${pinCodePattern}`] // ✅ NEW
      };

      const merchant = getState().merchant.merchantFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Email format is invalid.',
        'required.phoneNumber': 'Phone number is required.',
        'regex.phoneNumber': 'Phone number format is invalid.',
        'required.brandName': 'Brand is required.',
        'required.business': 'Business is required.',
        'min.business': 'Business must be at least 10 characters.',
        'required.pinCode': 'PIN Code is required.',              // ✅ NEW
        'regex.pinCode': 'PIN Code must be 6 digits.'             // ✅ NEW
      });

      if (!isValid) {
        return dispatch({ type: SET_MERCHANT_FORM_ERRORS, payload: errors });
      }

      dispatch(setMerchantLoading(true));
      dispatch(setMerchantSubmitting(true));

      const response = await axios.post(`${API_URL}/merchant/add`, merchant);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({ type: RESET_MERCHANT });
        if (isBack) dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantSubmitting(false));
      dispatch(setMerchantLoading(false));
    }
  };
};

export const fetchMerchants = (n, v) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setMerchantLoading(true));

      const response = await axios.get(`${API_URL}/merchant`, {
        params: {
          page: v ?? 1,
          limit: 20
        }
      });

      const { merchants, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_MERCHANTS,
        payload: merchants
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };
};

export const searchMerchants = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setMerchantLoading(true));

      const response = await axios.get(`${API_URL}/merchant/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({
        type: FETCH_SEARCHED_MERCHANTS,
        payload: response.data.merchants
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };
};

export const disableMerchant = (merchant, value, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/merchant/${merchant._id}/active`, {
        merchant: {
          isActive: value
        }
      });

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const approveMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/merchant/approve/${merchant._id}`);

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const rejectMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/merchant/reject/${merchant._id}`);

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const merchantSignUp = token => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        firstName: 'required',
        lastName: 'required'
      };

      const merchant = getState().merchant.signupFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.email': 'Email is required.',
        'required.password': 'Password is required.',
        'required.firstName': 'First Name is required.',
        'required.lastName': 'Last Name is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      await axios.post(`${API_URL}/merchant/signup/${token}`, merchant);

      const successfulOptions = {
        title: `You have signed up successfully! Please sign in with the email and password. Thank you!`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(signOut());
      dispatch(success(successfulOptions));
      dispatch(push('/login'));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
    }
  };
};

// delete merchant api
export const deleteMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(
        `${API_URL}/merchant/delete/${merchant._id}`
      );

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));

        if (search)
          return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result

        dispatch(fetchMerchants('merchant', page));

        // dispatch({
        //   type: REMOVE_MERCHANT,
        //   payload: merchant._id
        // });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
