// /*
//  *
//  * GrowthPartner actions
//  *
//  */

// import { push, goBack } from 'connected-react-router';
// import { success } from 'react-notification-system-redux';
// import axios from 'axios';

// import {
//   FETCH_GROWTH_PARTNERS,
//   REMOVE_GROWTH_PARTNER,
//   SET_GROWTH_PARTNER_FORM_ERRORS,
//   SET_GROWTH_PARTNER_LOADING,
//   SET_GROWTH_PARTNER_SUBMITTING,
//   RESET_GROWTH_PARTNER,
//   GROWTH_PARTNER_CHANGE,
//   SIGNUP_CHANGE,
//   SET_SIGNUP_FORM_ERRORS,
//   SIGNUP_RESET
// } from './constants';

// import handleError from '../../utils/error';
// import { allFieldsValidation } from '../../utils/validation';
// import { signOut } from '../Login/actions';
// import { API_URL } from '../../constants';

// export const growthPartnerChange = (name, value) => {
//   let formData = {};
//   formData[name] = value;

//   return {
//     type: GROWTH_PARTNER_CHANGE,
//     payload: formData
//   };
// };

// export const growthPartnerSignupChange = (name, value) => {
//   let formData = {};
//   formData[name] = value;

//   return {
//     type: SIGNUP_CHANGE,
//     payload: formData
//   };
// };

// export const setGrowthPartnerLoading = value => ({
//   type: SET_GROWTH_PARTNER_LOADING,
//   payload: value
// });

// export const setGrowthPartnerSubmitting = value => ({
//   type: SET_GROWTH_PARTNER_SUBMITTING,
//   payload: value
// });

// // Add Growth Partner
// export const addGrowthPartner = (isBack = false) => {
//   return async (dispatch, getState) => {
//     try {
//       const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

//       const rules = {
//         name: 'required',
//         email: 'required|email',
//         phoneNumber: ['required', `regex:${phoneno}`],
//         region: 'required',
//         strategy: 'required|min:10'
//       };

//       const data = getState().growthPartner.growthPartnerFormData;

//       const { isValid, errors } = allFieldsValidation(data, rules, {
//         'required.name': 'Name is required.',
//         'required.email': 'Email is required.',
//         'email.email': 'Invalid email format.',
//         'required.phoneNumber': 'Phone number is required.',
//         'regex.phoneNumber': 'Phone number format is invalid.',
//         'required.region': 'Region is required.',
//         'required.strategy': 'Strategy is required.',
//         'min.strategy': 'Strategy must be at least 10 characters.'
//       });

//       if (!isValid) {
//         return dispatch({ type: SET_GROWTH_PARTNER_FORM_ERRORS, payload: errors });
//       }

//       dispatch(setGrowthPartnerLoading(true));
//       dispatch(setGrowthPartnerSubmitting(true));

//       const response = await axios.post(`${API_URL}/growth-partner/add`, data);

//       const notification = {
//         title: `${response.data.message}`,
//         position: 'tr',
//         autoDismiss: 1
//       };

//       if (response.data.success) {
//         dispatch(success(notification));
//         dispatch({ type: RESET_GROWTH_PARTNER });
//         if (isBack) dispatch(goBack());
//       }
//     } catch (error) {
//       handleError(error, dispatch);
//     } finally {
//       dispatch(setGrowthPartnerSubmitting(false));
//       dispatch(setGrowthPartnerLoading(false));
//     }
//   };
// };

// // Fetch all growth partners
// export const fetchGrowthPartners = (n, v) => {
//   return async dispatch => {
//     try {
//       dispatch(setGrowthPartnerLoading(true));

//       const response = await axios.get(`${API_URL}/growth-partner`, {
//         params: { page: v ?? 1, limit: 20 }
//       });

//       dispatch({
//         type: FETCH_GROWTH_PARTNERS,
//         payload: response.data.growthPartners
//       });
//     } catch (error) {
//       handleError(error, dispatch);
//     } finally {
//       dispatch(setGrowthPartnerLoading(false));
//     }
//   };
// };

// // Delete a growth partner
// export const deleteGrowthPartner = (partner, search, page) => {
//   return async dispatch => {
//     try {
//       const response = await axios.delete(`${API_URL}/growth-partner/delete/${partner._id}`);

//       const notification = {
//         title: `${response.data.message}`,
//         position: 'tr',
//         autoDismiss: 1
//       };

//       if (response.data.success) {
//         dispatch(success(notification));
//         dispatch(fetchGrowthPartners('growth-partner', page));
//       }
//     } catch (error) {
//       handleError(error, dispatch);
//     }
//   };
// };

// // Growth partner signup (e.g. via token)
// export const growthPartnerSignUp = token => {
//   return async (dispatch, getState) => {
//     try {
//       const rules = {
//         email: 'required|email',
//         password: 'required|min:6',
//         firstName: 'required',
//         lastName: 'required'
//       };

//       const user = getState().growthPartner.signupFormData;

//       const { isValid, errors } = allFieldsValidation(user, rules, {
//         'required.email': 'Email is required.',
//         'required.password': 'Password is required.',
//         'required.firstName': 'First Name is required.',
//         'required.lastName': 'Last Name is required.'
//       });

//       if (!isValid) {
//         return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
//       }

//       await axios.post(`${API_URL}/growth-partner/signup/${token}`, user);

//       dispatch(signOut());
//       dispatch(success({
//         title: `Signed up successfully! You can now sign in.`,
//         position: 'tr',
//         autoDismiss: 1
//       }));
//       dispatch(push('/login'));
//       dispatch({ type: SIGNUP_RESET });
//     } catch (error) {
//       handleError(error, dispatch, 'Signup failed. Please try again.');
//     }
//   };
// };




/*
 *
 * GrowthPartner actions
 *
 */

import { push, goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_GROWTH_PARTNERS,
  FETCH_SEARCHED_GROWTH_PARTNERS,
  REMOVE_GROWTH_PARTNER,
  SET_ADVANCED_FILTERS,
  SET_GROWTH_PARTNER_FORM_ERRORS,
  SET_GROWTH_PARTNER_LOADING,
  SET_GROWTH_PARTNER_SUBMITTING,
  RESET_GROWTH_PARTNER,
  GROWTH_PARTNER_CHANGE,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { signOut } from '../Login/actions';
import { API_URL } from '../../constants';
import { toggleSubscriptionModal } from '../Subscription/actions';

// Input Change for Form
export const growthPartnerChange = (name, value) => {
  return {
    type: GROWTH_PARTNER_CHANGE,
    payload: { name, value }
  };
};

// Input Change for Signup
export const growthPartnerSignupChange = (name, value) => {
  return {
    type: SIGNUP_CHANGE,
    payload: { name, value }
  };
};

export const setGrowthPartnerLoading = value => ({
  type: SET_GROWTH_PARTNER_LOADING,
  payload: value
});

export const setGrowthPartnerSubmitting = value => ({
  type: SET_GROWTH_PARTNER_SUBMITTING,
  payload: value
});

// Add Growth Partner with subscription flow
export const addGrowthPartnerWithSubscription = () => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        region: 'required',
        strategy: 'required|min:10'
      };

      const growthpartner = getState().growthPartner.growthPartnerFormData;

      const { isValid, errors } = allFieldsValidation(growthpartner, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Invalid email format.',
        'required.phoneNumber': 'Phone number is required.',
        'regex.phoneNumber': 'Phone number format is invalid.',
        'required.region': 'Region is required.',
        'required.strategy': 'Strategy is required.',
        'min.strategy': 'Strategy must be at least 10 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_GROWTH_PARTNER_FORM_ERRORS, payload: errors });
      }

      // Store growth partner data temporarily and open subscription modal
      dispatch({
        type: 'SET_PENDING_GROWTH_PARTNER_DATA',
        payload: growthpartner
      });

      // Open subscription modal for growth partners
      dispatch(toggleSubscriptionModal(true, 'Other Growth Partner'));

    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Add Growth Partner (original - for admin dashboard)
export const addGrowthPartner = (isBack = false) => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        region: 'required',
        strategy: 'required|min:10'
      };

      const growthpartner = getState().growthPartner.growthPartnerFormData;

      const { isValid, errors } = allFieldsValidation(growthpartner, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Invalid email format.',
        'required.phoneNumber': 'Phone number is required.',
        'regex.phoneNumber': 'Phone number format is invalid.',
        'required.region': 'Region is required.',
        'required.strategy': 'Strategy is required.',
        'min.strategy': 'Strategy must be at least 10 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_GROWTH_PARTNER_FORM_ERRORS, payload: errors });
      }

      dispatch(setGrowthPartnerLoading(true));
      dispatch(setGrowthPartnerSubmitting(true));

      const response = await axios.post(`${API_URL}/growthpartner/add`, growthpartner);

      const notification = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success) {
        dispatch(success(notification));
        dispatch({ type: RESET_GROWTH_PARTNER });
        if (isBack) dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setGrowthPartnerSubmitting(false));
      dispatch(setGrowthPartnerLoading(false));
    }
  };
};

// Fetch All Growth Partners


export const fetchGrowthPartners = (n, v) => {
  return async (dispatch, getState) => {
    try {
      // 1️⃣  show loader
      dispatch(setGrowthPartnerLoading(true));

      // 2️⃣  API call (keeps the same pagination defaults as merchants)
      const response = await axios.get(`${API_URL}/growthpartner`, {
        params: {
          page: v ?? 1,
          limit: 20
        }
      });

      // 3️⃣  destructure the response just like in fetchMerchants
      const {
        growthpartners,
        totalPages,
        currentPage,
        count
      } = response.data;

      // 4️⃣  list payload
      dispatch({
        type: FETCH_GROWTH_PARTNERS,
        payload: growthpartners
      });

      // 5️⃣  update advanced-filter meta (re-use the same constant)
      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      // 6️⃣  hide loader
      dispatch(setGrowthPartnerLoading(false));
    }
  };
};


// Delete Growth Partner
export const deleteGrowthPartner = (growthpartner, search, page) => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${API_URL}/growthpartner/delete/${growthpartner._id}`);

      const notification = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success) {
        dispatch(success(notification));
        dispatch(fetchGrowthPartners('growthpartner', page));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// this is new section 

// --- NEW ACTIONS YOU NEED ---

/* Approve */
export const approveGrowthPartner = (partner, search = '', page = 1) => async dispatch => {
  try {
    await axios.put(`${API_URL}/growthpartner/approve/${partner._id}`);
    dispatch(fetchGrowthPartners('growthpartner', page));  // refresh list
    dispatch(success({ title: 'Partner approved', position: 'tr', autoDismiss: 1 }));
  } catch (err) {
    handleError(err, dispatch);
  }
};

/* Reject */
export const rejectGrowthPartner = (partner, search = '', page = 1) => async dispatch => {
  try {
    await axios.put(`${API_URL}/growthpartner/reject/${partner._id}`);
    dispatch(fetchGrowthPartners('growthpartner', page));
    dispatch(success({ title: 'Partner rejected', position: 'tr', autoDismiss: 1 }));
  } catch (err) {
    handleError(err, dispatch);
  }
};

/* Enable / Disable (toggle) */
export const disableGrowthPartner = (partner, makeActive, search = '', page = 1) => async dispatch => {
  try {
    await axios.put(`${API_URL}/growthpartner/approve/${partner._id}`, { isActive: makeActive });
    dispatch(fetchGrowthPartners('growthpartner', page));
  } catch (err) {
    handleError(err, dispatch);
  }
};

// /* Search */
// export const searchGrowthPartners = ({ value }) => async dispatch => {
//   try {
//     dispatch(setGrowthPartnerLoading(true));
//     const { data } = await axios.get(`${API_URL}/growthpartner/search`, {
//       params: { search: value }
//     });
//     dispatch({ type: FETCH_GROWTH_PARTNERS, payload: data.growthpartners });
//   } catch (err) {
//     handleError(err, dispatch);
//   }
//   console.log('Searching:', value);
// console.log('Response:', data.growthpartners);

// };
export const searchGrowthPartners = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setGrowthPartnerLoading(true));

      const response = await axios.get(`${API_URL}/growthpartner/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({
        type: FETCH_SEARCHED_GROWTH_PARTNERS,
        payload: response.data.growthpartners
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setGrowthPartnerLoading(false));
    }
  };
};


//section end

// Growth Partner Signup via Token
export const growthPartnerSignUp = token => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        firstName: 'required',
        lastName: 'required'
      };

      const user = getState().growthpartner.signupFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.email': 'Email is required.',
        'required.password': 'Password is required.',
        'required.firstName': 'First Name is required.',
        'required.lastName': 'Last Name is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      await axios.post(`${API_URL}/growthpartner/signup/${token}`, user);

      dispatch(signOut());
      dispatch(success({
        title: `Signed up successfully! You can now sign in.`,
        position: 'tr',
        autoDismiss: 1
      }));
      dispatch(push('/login'));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      handleError(error, dispatch, 'Signup failed. Please try again.');
    }
  };
};




// export const fetchGrowthPartners = (n, v) => {
//   return async dispatch => {
//     try {
//       dispatch(setGrowthPartnerLoading(true));

//       const response = await axios.get(`${API_URL}/growthpartner`, {
//         params: { page: v ?? 1, limit: 20 }
//       });

//       dispatch({
//         type: FETCH_GROWTH_PARTNERS,
//         payload: response.data.growthPartners
//       });
//     } catch (error) {
//       handleError(error, dispatch);
//     } finally {
//       dispatch(setGrowthPartnerLoading(false));
//     }
//   };
// };