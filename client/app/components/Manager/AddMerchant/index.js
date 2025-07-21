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
import { Row, Col } from 'reactstrap';
import Input from '../../Common/Input';
import Button from '../../Common/Button';
import axios from 'axios';
import { API_URL } from '../../../constants';

const AddMerchant = props => {
  const {
    merchantFormData,
    formErrors,
    isSubmitting,
    submitTitle = 'Submit',
    merchantChange,
    addMerchant
  } = props;

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
        merchantChange('city', '');
        merchantChange('state', '');
        console.error('Invalid PIN Code');
      }
    } else {
      merchantChange('city', '');
      merchantChange('state', '');
    }
  };

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
              value={merchantFormData.business}
              onInputChange={merchantChange}
            />
          </Col>

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

