/**
 *
 * SignupProvider
 *
 */

import React from 'react';

import { GoogleIcon, FacebookIcon } from '../Icon';
import { API_URL } from '../../../constants';

const SignupProvider = ({ disabled = false }) => {
  const handleClick = e => {
    if (disabled) e.preventDefault();
  };

  return (
    <div className='signup-provider'>
      <a
        href={disabled ? '#' : `${API_URL}/auth/google`}
        onClick={handleClick}
        aria-disabled={disabled}
        className={`mb-2 google-btn${disabled ? ' disabled' : ''}`}
      >
        <GoogleIcon />
        <span className='btn-text'>Login with Google</span>
      </a>

      <a
        href={disabled ? '#' : `${API_URL}/auth/facebook`}
        onClick={handleClick}
        aria-disabled={disabled}
        className={`facebook-btn${disabled ? ' disabled' : ''}`}
      >
        <FacebookIcon />
        <span className='btn-text'>Login with Facebook</span>
      </a>
    </div>
  );
};

export default SignupProvider;
