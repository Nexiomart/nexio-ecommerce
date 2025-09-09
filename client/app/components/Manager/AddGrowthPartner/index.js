// /**
//  *
//  * AddGrowthPartner
//  *
//  */


/**
 *
 * AddGrowthPartner
 *
 */

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Button from '../../Common/Button';
import axios from 'axios';
import { API_URL } from '../../../constants';

const AddGrowthPartner = props => {
  const {
    growthPartnerFormData,
    formErrors,
    isSubmitting,
    submitTitle = 'Submit',
    growthPartnerChange,
    addGrowthPartner
  } = props;

  const [referralState, setReferralState] = useState({ status: 'idle', info: null, error: null });



  // Real-time referral validation
  useEffect(() => {
    const code = (growthPartnerFormData.referredByGP || '').trim();
    if (!code) { setReferralState({ status: 'idle', info: null, error: null }); return; }

    let cancelled = false;
    setReferralState(prev => ({ ...prev, status: 'checking', error: null }));
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/referral/lookup/${encodeURIComponent(code)}`);
        if (cancelled) return;
        setReferralState({ status: 'valid', info: res.data, error: null });
      } catch (err) {
        if (cancelled) return;
        const msg = err?.error || 'Invalid or inactive referral ID.';
        setReferralState({ status: 'invalid', info: null, error: msg });
      }
    }, 400);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [growthPartnerFormData.referredByGP]);


  const handleSubmit = event => {
    event.preventDefault();
    addGrowthPartner();
  };

  return (
    <div className='add-growth-partner'>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['name']}
              label='Name'
              name='name'
              placeholder='Your Full Name'
              value={growthPartnerFormData.name}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['email']}
              label='Email Address'
              name='email'
              placeholder='Your Email Address'
              value={growthPartnerFormData.email}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          {/* Referred by (Optional) - Accept GRW-xxxx or MER-xxxx */}
          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['referredByGP']}
              label='Referred by (Optional)'
              name='referredByGP'
              placeholder='Enter Growth Partner ID (GRW-XXXXXX) or Merchant ID (MER-XXXXXX)'
              value={growthPartnerFormData.referredByGP}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
            {growthPartnerFormData.referredByGP && (
              <div className='mt-1'>
                {referralState.status === 'checking' && (
                  <small className='text-muted'><i className='fa fa-spinner fa-spin mr-1'></i>Checking referral...</small>
                )}
                {referralState.status === 'valid' && referralState.info && (
                  <small className='text-success'><i className='fa fa-check-circle mr-1'></i>{`${referralState.info.name} (${referralState.info.type})`}</small>
                )}
                {referralState.status === 'invalid' && (
                  <small className='text-danger'><i className='fa fa-times-circle mr-1'></i>{referralState.error || 'Invalid or inactive referral ID.'}</small>
                )}
              </div>
            )}
            <small className='text-muted'>
              <i className='fa fa-info-circle mr-1'></i>
              Enter a Growth Partner (GRW-...) or Merchant (MER-...) unique ID.
            </small>
          </Col>

          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['phoneNumber']}
              label='Phone Number'
              name='phoneNumber'
              placeholder='Your Phone Number'
              value={growthPartnerFormData.phoneNumber}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          <Col xs='12'>
            <Input
              type='text'
              error={formErrors['region']}
              label='Region/City'
              name='region'
              placeholder='Your Region or City'
              value={growthPartnerFormData.region}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          <Col xs='12'>
            <Input
              type='textarea'
              error={formErrors['strategy']}
              label='Marketing Strategy'
              name='strategy'
              placeholder='Describe how you plan to grow the platform or bring in users.'
              value={growthPartnerFormData.strategy}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          {/* Profile Photo */}
          <Col xs='12'>
            <Input
              type='file'
              error={formErrors['profileImage']}
              label='Profile Photo'
              name='profileImage'
              placeholder='Upload your profile image'
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col>

          {/* <Col xs='12'>
            <Input
              type='text'
              error={formErrors['referralCode']}
              label='Referral Code (Optional)'
              name='referralCode'
              placeholder='Enter referral code if you have one'
              value={growthPartnerFormData.referralCode}
              onInputChange={(name, value) => {
                growthPartnerChange(name, value);
              }}
            />
          </Col> */}
        </Row>

        <hr />
        <div className='add-growth-partner-actions'>
          <Button
            type='submit'
            text={submitTitle}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default AddGrowthPartner;



// import React from 'react';

// import { Row, Col } from 'reactstrap';

// import Input from '../../Common/Input';
// import Button from '../../Common/Button';

// const AddGrowthPartner = props => {
//   const {
//     growthPartnerFormData,
//     formErrors,
//     isSubmitting,
//     submitTitle = 'Submit',
//     growthPartnerChange,
//     addGrowthPartner
//   } = props;

//   const handleSubmit = event => {
//     event.preventDefault();
//     addGrowthPartner();
//   };

//   return (
//     <div className='add-growth-partner'>
//       <form onSubmit={handleSubmit}>
//         <Row>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['name']}
//               label={'Name'}
//               name={'name'}
//               placeholder={'Your Full Name'}
//               value={growthPartnerFormData.name}
//               onInputChange={(name, value) => {
//                 growthPartnerChange(name, value);
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
//               value={growthPartnerFormData.email}
//               onInputChange={(name, value) => {
//                 growthPartnerChange(name, value);
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
//               value={growthPartnerFormData.phoneNumber}
//               onInputChange={(name, value) => {
//                 growthPartnerChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'text'}
//               error={formErrors['region']}
//               label={'Region/City'}
//               name={'region'}
//               placeholder={'Your Region or City'}
//               value={growthPartnerFormData.region}
//               onInputChange={(name, value) => {
//                 growthPartnerChange(name, value);
//               }}
//             />
//           </Col>
//           <Col xs='12'>
//             <Input
//               type={'textarea'}
//               error={formErrors['strategy']}
//               label={'Marketing Strategy'}
//               name={'strategy'}
//               placeholder={'Describe how you plan to grow the platform or bring in users.'}
//               value={growthPartnerFormData.strategy}
//               onInputChange={(name, value) => {
//                 growthPartnerChange(name, value);
//               }}
//             />
//           </Col>
//         </Row>
//         <hr />
//         <div className='add-growth-partner-actions'>
//           <Button type='submit' text={submitTitle} disabled={isSubmitting} />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddGrowthPartner;
