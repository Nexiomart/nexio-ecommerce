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

class Contact extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.contactUs();
  };

  render() {
    const { contactFormData, contactFormChange, formErrors } = this.props;

    return (
      <div className="bg-[#FFF5E1] min-h-screen py-16 px-6 sm:px-10 lg:px-24 font-sans">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Let’s connect! Whether you have a question or just want to say hello — we’d love to hear from you.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Contact Info */}
          <div className="w-full lg:w-1/2 space-y-8 text-gray-800">
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-2xl text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Email</h4>
                <p>nexiomart007@gmail.com</p>
                <p>anuj@nexiomart.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-2xl text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Phone</h4>
                <p>+91-9111777280</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-2xl text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Location</h4>
                <p>Delhi,India</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <h4 className="font-semibold text-lg">Support Hours</h4>
              <p>Mon – Fri, 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form onSubmit={this.handleSubmit} className="w-full lg:w-1/2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                error={formErrors['name']}
                label="Name"
                name="name"
                placeholder="Your Full Name"
                value={contactFormData.name}
                onInputChange={(name, value) => contactFormChange(name, value)}
              />
              <Input
                type="text"
                error={formErrors['email']}
                label="Email"
                name="email"
                placeholder="Your Email Address"
                value={contactFormData.email}
                onInputChange={(name, value) => contactFormChange(name, value)}
              />
            </div>

            <Input
              type="textarea"
              error={formErrors['message']}
              label="Message"
              name="message"
              placeholder="Write your message here..."
              value={contactFormData.message}
              onInputChange={(name, value) => contactFormChange(name, value)}
            />

            <div className="text-right">
              <Button type="submit" text="Send Message" />
            </div>
          </form>
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
