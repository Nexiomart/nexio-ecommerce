// /**
//  *
//  * AddMerchant
//  *
//  */

// import React from 'react';

// import { Row, Col } from 'reactstrap';

// import Input from '../../Common/Input';
// import Button from '../../Common/Button';

// const AddMerchant = props => {
//   const {
//     merchantFormData,
//     formErrors,
//     isSubmitting,
//     submitTitle = 'Submit',
//     merchantChange,
//     addMerchant
//   } = props;

//   const handleSubmit = event => {
//     event.preventDefault();
//     addMerchant();
//   };

//   return (
//     <div className='add-merchant'>
//       <form onSubmit={handleSubmit}>
//         <Row>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['name']}
//               label={'Name'}
//               name={'name'}
//               placeholder={'Your Full Name'}
//               value={merchantFormData.name}
//               onInputChange={(name, value) => {
//                 merchantChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['email']}
//               label={'Email Address'}
//               name={'email'}
//               placeholder={'Your Email Address'}
//               value={merchantFormData.email}
//               onInputChange={(name, value) => {
//                 merchantChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['phoneNumber']}
//               label={'Phone Number'}
//               name={'phoneNumber'}
//               placeholder={'Your Phone Number'}
//               value={merchantFormData.phoneNumber}
//               onInputChange={(name, value) => {
//                 merchantChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['brandName']}
//               label={'Brand'}
//               name={'brandName'}
//               placeholder={'Your Business Brand'}
//               value={merchantFormData.brand}
//               onInputChange={(name, value) => {
//                 merchantChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'textarea'}
//               error={formErrors['business']}
//               label={'Business'}
//               name={'business'}
//               placeholder={'Please Describe Your Business'}
//               value={merchantFormData.business}
//               onInputChange={(name, value) => {
//                 merchantChange(name, value);
//               }}
//             />
//           </Col>
//         </Row>
//         <hr />
//         <div className='add-merchant-actions'>
//           <Button type='submit' text={submitTitle} disabled={isSubmitting} />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddMerchant;

import React from 'react';
// import React, { useEffect, useState } from 'react';  // Commented out useEffect, useState for manufacturer forms
import { Row, Col } from 'reactstrap';
import Input from '../../Common/Input';
import Button from '../../Common/Button';
import axios from 'axios';  // Needed for PIN code functionality
import { API_URL } from '../../../constants';  // Needed for PIN code functionality
// Note: Referral functionality is commented out, but PIN code functionality remains active

const AddMerchant = props => {
  const {
    merchantFormData,
    formErrors,
    isSubmitting,
    submitTitle = 'Submit',
    merchantChange,
    addMerchant,
    currentUser  // Keep for compatibility with merchant forms, even though referral functionality is commented out
    // showReferralField = true  // Commented out for manufacturer forms
  } = props;

  // Commented out for manufacturer forms - uncomment to enable referral state
  // const [referralState, setReferralState] = useState({
  //   status: 'idle', // idle | checking | valid | invalid | self
  //   info: null,
  //   error: null
  // });

  const handleSubmit = event => {
    event.preventDefault();
    addMerchant();
  };

  const handlePinCodeChange = async (name, value) => {
    merchantChange(name, value);

    if (value.length === 6) {
      try {
        const response = await axios.get(`${API_URL}/location/${value}`);

        const { city, state } = response.data;

        // ✅ auto-store city/state silently in the form data
        merchantChange('city', city);
        merchantChange('state', state);
      } catch (err) {
        console.error('Invalid PIN Code');
        merchantChange('city', '');
        merchantChange('state', '');
      }
    } else {
      merchantChange('city', '');
      merchantChange('state', '');
    }
  };

  // Real-time referral validation
  /* Commented out for manufacturer forms - uncomment to enable referral validation
  useEffect(() => {
    const code = (merchantFormData.referredByGP || '').trim();
    if (!code) {
      setReferralState({ status: 'idle', info: null, error: null });
      return;
    }

    // Prevent self-referral if current user exists and has matching uniqueId prefix
    if (currentUser) {
      const myUniqueId = currentUser?.growthPartner?.uniqueId || currentUser?.merchant?.uniqueId;
      if (myUniqueId && myUniqueId === code) {
        setReferralState({ status: 'self', info: null, error: 'Self-referral not allowed' });
        return;
      }
    }

    let cancelled = false;
    setReferralState(prev => ({ ...prev, status: 'checking', error: null }));
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/referral/lookup/${encodeURIComponent(code)}`);
        if (cancelled) return;
        const info = res.data;
        setReferralState({ status: 'valid', info, error: null });
      } catch (err) {
        if (cancelled) return;
        const msg = err?.response?.data?.error || 'Invalid or inactive referral ID.';
        setReferralState({ status: 'invalid', info: null, error: msg });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [merchantFormData.referredByGP, currentUser]);
  */

  return (
    <div className='add-merchant'>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['name']}
              label='Name'
              name='name'
              placeholder='Your Full Name'
              value={merchantFormData.name}
              onInputChange={merchantChange}
            />
          </Col>
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['email']}
              label='Email Address'
              name='email'
              placeholder='Your Email Address'
              value={merchantFormData.email}
              onInputChange={merchantChange}
            />
          </Col>
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['phoneNumber']}
              label='Phone Number'
              name='phoneNumber'
              placeholder='Your Phone Number'
              value={merchantFormData.phoneNumber}
              onInputChange={merchantChange}
            />
          </Col>
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['brandName']}
              label='Brand'
              name='brandName'
              placeholder='Your Business Brand'
              value={merchantFormData.brandName}
              onInputChange={merchantChange}
            />
          </Col>
          <Col xs='12'>
            <Input
              type='textarea'
              error={formErrors['business']}
              label='Business'
              name='business'
              placeholder='Please Describe Your Business'
              rows='3'
              value={merchantFormData.business}
              onInputChange={merchantChange}
            />
          </Col>

          {/* 🔽 COMMENTED OUT: Referred by (Optional) - Accept GRW-xxxx or MER-xxxx
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['referredByGP']}
              label='Referred by (Optional)'
              name='referredByGP'
              placeholder='Enter Growth Partner ID (GRW-XXXXXX) or Merchant ID (MER-XXXXXX)'
              value={merchantFormData.referredByGP}
              onInputChange={merchantChange}
            />
            {merchantFormData.referredByGP && (
              <div className="mt-1">
                {referralState.status === 'checking' && (
                  <small className="text-muted"><i className="fa fa-spinner fa-spin mr-1"></i>Checking referral...</small>
                )}
                {referralState.status === 'valid' && referralState.info && (
                  <small className="text-success"><i className="fa fa-check-circle mr-1"></i>{`${referralState.info.name} (${referralState.info.type})`}</small>
                )}
                {referralState.status === 'self' && (
                  <small className="text-warning"><i className="fa fa-exclamation-triangle mr-1"></i>You cannot refer yourself.</small>
                )}
                {referralState.status === 'invalid' && (
                  <small className="text-danger"><i className="fa fa-times-circle mr-1"></i>{referralState.error || 'Invalid or inactive referral ID.'}</small>
                )}
              </div>
            )}
            <small className="text-muted">
              <i className="fa fa-info-circle mr-1"></i>
              Enter a Growth Partner (GRW-...) or Merchant (MER-...) unique ID.
            </small>
          </Col>
          */}

          {/* 🔽 Only PIN Code Field (auto-fills city/state in background) */}
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['pinCode']}
              label='PIN Code'
              name='pinCode'
              placeholder='Enter 6-digit PIN code'
              value={merchantFormData.pincode}
              onInputChange={handlePinCodeChange}
            />
          </Col>
        </Row>

        <hr />
        <div className='add-merchant-actions'>
          <Button type='submit' text={submitTitle} disabled={isSubmitting} />
        </div>
      </form>
    </div>
  );
};

export default AddMerchant;

