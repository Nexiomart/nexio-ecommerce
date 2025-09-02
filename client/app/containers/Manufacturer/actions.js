/* Manufacturer actions */

import { push, goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

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

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const manufacturerChange = (name, value) => ({
  type: MANUFACTURER_CHANGE,
  payload: { [name]: value }
});

export const manufacturerSignupChange = (name, value) => ({
  type: SIGNUP_CHANGE,
  payload: { [name]: value }
});

export const setManufacturerLoading = value => ({
  type: SET_MANUFACTURERS_LOADING,
  payload: value
});

export const setManufacturerSubmitting = value => ({
  type: SET_MANUFACTURERS_SUBMITTING,
  payload: value
});

export const addManufacturer = (isBack = false) => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        brandName: 'required',
        business: 'required|min:10'
      };

      const manufacturer = getState().manufacturer.manufacturerFormData;
      const { isValid, errors } = allFieldsValidation(manufacturer, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Email format is invalid.',
        'regex.phoneNumber': 'Phone number must be valid.',
        'required.brandName': 'Brand is required.',
        'required.business': 'Business is required.',
        'min.business': 'Business should be at least 10 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_MANUFACTURER_FORM_ERRORS, payload: errors });
      }

      dispatch(setManufacturerLoading(true));
      dispatch(setManufacturerSubmitting(true));

      const response = await axios.post(`${API_URL}/manufacturer/public/add`, manufacturer);

      const successfulOptions = { title: `${response.data.message}` , position: 'tr', autoDismiss: 1 };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({ type: RESET_MANUFACTURER });
        if (isBack) dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setManufacturerSubmitting(false));
      dispatch(setManufacturerLoading(false));
    }
  };
};

export const fetchManufacturers = (n, v) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setManufacturerLoading(true));

      const response = await axios.get(`${API_URL}/manufacturer`, { params: { page: v ?? 1, limit: 20 } });
      const { manufacturers, totalPages, currentPage, count } = response.data;

      dispatch({ type: FETCH_MANUFACTURERS, payload: manufacturers });
      dispatch({ type: SET_ADVANCED_FILTERS, payload: { totalPages, currentPage, count } });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setManufacturerLoading(false));
    }
  };
};

export const disableManufacturer = (manufacturer, value, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/manufacturer/${manufacturer._id}/active`, { manufacturer: { isActive: value } });
      dispatch(fetchManufacturers('manufacturer', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const approveManufacturer = (manufacturer, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/manufacturer/approve/${manufacturer._id}`);
      dispatch(fetchManufacturers('manufacturer', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const rejectManufacturer = (manufacturer, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`${API_URL}/manufacturer/reject/${manufacturer._id}`);
      dispatch(fetchManufacturers('manufacturer', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const deleteManufacturer = (manufacturer, search, page) => {
  return async (dispatch, getState) => {
    try {
      await axios.delete(`${API_URL}/manufacturer/delete/${manufacturer._id}`);
      dispatch(fetchManufacturers('manufacturer', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const manufacturerSignUp = token => {
  return async (dispatch, getState) => {
    try {
      const manufacturer = getState().manufacturer.signupFormData;

      await axios.post(`${API_URL}/manufacturer/signup/${token}`, manufacturer);

      const successfulOptions = {
        title: `You have signed up successfully! Please sign in with the email and password. Thank you!`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
      dispatch(push('/login'));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
    }
  };
};

