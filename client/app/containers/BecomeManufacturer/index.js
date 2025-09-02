/* Become Manufacturer (public join page) */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import actions from '../../actions';

import LoadingIndicator from '../../components/Common/LoadingIndicator';
import AddMerchant from '../../components/Manager/AddMerchant';

import './style.scss';

class BecomeManufacturer extends React.PureComponent {
  render() {
    const { manufacturerFormData, formErrors, isSubmitting, manufacturerChange, addManufacturer, isLoading } = this.props;

    return (
      <div className='become-manufacturer-page'>
        {isLoading && <LoadingIndicator />}
        <h3 className='text-uppercase'>Become a Manufacturer</h3>
        <hr />
        <Row>
          <Col xs='12' md='6' className='order-2 order-md-1'>
            <AddMerchant
              merchantFormData={manufacturerFormData}
              formErrors={formErrors}
              isSubmitting={isSubmitting}
              submitTitle='Submit'
              merchantChange={manufacturerChange}
              addMerchant={addManufacturer}
            />
          </Col>
          <Col xs='12' md='6' className='order-1 order-md-2'>
            <div className='info-box'>
              <h4>Partner with us as a Manufacturer</h4>
              <p>Join Nexiomart to showcase your products directly to our customers. Apply today—admin approval required.</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  manufacturerFormData: state.manufacturer.manufacturerFormData,
  formErrors: state.manufacturer.formErrors,
  isSubmitting: state.manufacturer.isSubmitting,
  isLoading: state.manufacturer.isLoading
});

export default connect(mapStateToProps, actions)(BecomeManufacturer);

