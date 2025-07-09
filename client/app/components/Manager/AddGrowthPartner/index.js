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

import React from 'react';
import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Button from '../../Common/Button';

const AddGrowthPartner = props => {
  const {
    growthPartnerFormData,
    formErrors,
    isSubmitting,
    submitTitle = 'Submit',
    growthPartnerChange,
    addGrowthPartner
  } = props;

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
