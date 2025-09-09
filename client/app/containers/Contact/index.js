// /*
//  *
//  * Contact
//  *
//  */

// import React from 'react';

// import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';

// import actions from '../../actions';

// import Input from '../../components/Common/Input';
// import Button from '../../components/Common/Button';

// class Contact extends React.PureComponent {
//   render() {
//     const { contactFormData, contactFormChange, contactUs, formErrors } =
//       this.props;

//     const handleSubmit = event => {
//       event.preventDefault();
//       contactUs();
//     };

//     return (
//       <div className='contact'>
//         <h3 className='text-uppercase'>Contact Information</h3>
//         <hr />
//         <form onSubmit={handleSubmit}>
//           <Row>
//             <Col xs='12' md='6'>
//               <Input
//                 type={'text'}
//                 error={formErrors['name']}
//                 label={'Name'}
//                 name={'name'}
//                 placeholder={'You Full Name'}
//                 value={contactFormData.name}
//                 onInputChange={(name, value) => {
//                   contactFormChange(name, value);
//                 }}
//               />
//             </Col>
//             <Col xs='12' md='6'>
//               <Input
//                 type={'text'}
//                 error={formErrors['email']}
//                 label={'Email'}
//                 name={'email'}
//                 placeholder={'Your Email Address'}
//                 value={contactFormData.email}
//                 onInputChange={(name, value) => {
//                   contactFormChange(name, value);
//                 }}
//               />
//             </Col>
//             <Col xs='12' md='12'>
//               <Input
//                 type={'textarea'}
//                 error={formErrors['message']}
//                 label={'Message'}
//                 name={'message'}
//                 placeholder={'Please Describe Your Message'}
//                 value={contactFormData.message}
//                 onInputChange={(name, value) => {
//                   contactFormChange(name, value);
//                 }}
//               />
//             </Col>
//           </Row>
//           <hr />
//           <div className='contact-actions'>
//             <Button type='submit' text='Submit' />
//           </div>
//         </form>
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     contactFormData: state.contact.contactFormData,
//     formErrors: state.contact.formErrors
//   };
// };

// export default connect(mapStateToProps, actions)(Contact);

import React from 'react';
import { connect } from 'react-redux';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

import actions from '../../actions';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import './style.scss';

class Contact extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.contactUs();
  };

  render() {
    const { contactFormData, contactFormChange, formErrors } = this.props;

    return (
      <div className='contact-page'>
        <div className='contact-header'>
          <h2>Contact Us</h2>
          <p>Let’s connect! Whether you have a question or just want to say hello — we’d love to hear from you.</p>
        </div>

        <div className='contact-card'>
          <div className='contact-content'>
            {/* Left: Contact Info */}
            <div className='contact-info'>
              <div className='info-row'>
                <span className='info-icon'><FaEnvelope /></span>
                <div>
                  <h4>Email</h4>
                  <p>Partnerships@nexiomart.com</p>
                  <p>nexiomart007@gmail.com</p>
                  <p>anuj@nexiomart.com</p>
                </div>
              </div>

              <div className='info-row'>
                <span className='info-icon'><FaPhoneAlt /></span>
                <div>
                  <h4>Phone</h4>
                  <p>+91-8319918953</p>
                  <p>+91-9111777280</p>
                </div>
              </div>

              <div className='info-row'>
                <span className='info-icon'><FaMapMarkerAlt /></span>
                <div>
                  <h4>Location</h4>
                  <p>Delhi,India</p>
                </div>
              </div>

              <div className='info-separator'>
                <h4>Support Hours</h4>
                <p>Mon – Fri, 9:00 AM – 6:00 PM IST</p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <form onSubmit={this.handleSubmit} className='contact-form'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <Input
                  type='text'
                  error={formErrors['name']}
                  label='Name'
                  name='name'
                  placeholder='Your Full Name'
                  value={contactFormData.name}
                  onInputChange={(name, value) => contactFormChange(name, value)}
                />
                <Input
                  type='text'
                  error={formErrors['email']}
                  label='Email'
                  name='email'
                  placeholder='Your Email Address'
                  value={contactFormData.email}
                  onInputChange={(name, value) => contactFormChange(name, value)}
                />
              </div>

              <Input
                type='textarea'
                error={formErrors['message']}
                label='Message'
                name='message'
                placeholder='Write your message here...'
                value={contactFormData.message}
                onInputChange={(name, value) => contactFormChange(name, value)}
              />

              <div className='form-actions'>
                <Button type='submit' text='Send Message' />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contactFormData: state.contact.contactFormData,
  formErrors: state.contact.formErrors,
});

export default connect(mapStateToProps, actions)(Contact);
