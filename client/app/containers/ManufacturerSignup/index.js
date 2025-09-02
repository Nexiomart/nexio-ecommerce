/*
 * ManufacturerSignup
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

class ManufacturerSignup extends React.PureComponent {
  componentDidMount() {
    const email = this.props.location.search.split('=')[1];
    this.props.manufacturerSignupChange('email', email);
  }

  render() {
    const { signupFormData, formErrors, manufacturerSignupChange, manufacturerSignUp } = this.props;

    const handleSubmit = event => {
      const token = this.props.match.params.token;
      event.preventDefault();
      manufacturerSignUp(token);
    };

    return (
      <div className='manufacturer-signup-form'>
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col xs={{ size: 12 }} md={{ size: 6, offset: 3 }} className='p-0'>
              <Col xs='12' md='12'>
                <h2 className='text-center'>Complete Sign Up</h2>
                <hr />
              </Col>

              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['email']}
                  label={'Email Address'}
                  name={'email'}
                  placeholder={'Please Enter Your Email'}
                  value={signupFormData.email}
                  onInputChange={(name, value) => manufacturerSignupChange(name, value)}
                />
              </Col>
              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['firstName']}
                  label={'First Name'}
                  name={'firstName'}
                  placeholder={'Please Enter Your First Name'}
                  value={signupFormData.firstName}
                  onInputChange={(name, value) => manufacturerSignupChange(name, value)}
                />
              </Col>
              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['lastName']}
                  label={'Last Name'}
                  name={'lastName'}
                  placeholder={'Please Enter Your Last Name'}
                  value={signupFormData.lastName}
                  onInputChange={(name, value) => manufacturerSignupChange(name, value)}
                />
              </Col>
              <Col xs='12' md='12'>
                <Input
                  type={'password'}
                  label={'Password'}
                  error={formErrors['password']}
                  name={'password'}
                  placeholder={'Please Enter Your Password'}
                  value={signupFormData.password}
                  onInputChange={(name, value) => manufacturerSignupChange(name, value)}
                />
              </Col>
              <Col xs='12' md='12'>
                <Button className='mt-3' type='submit' variant='primary' text='Get Started' />
              </Col>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  signupFormData: state.manufacturer.signupFormData,
  formErrors: state.manufacturer.signupFormErrors
});

export default connect(mapStateToProps, actions)(ManufacturerSignup);

