/*
 *
 * JoinAsGrowthPartner
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import AddGrowthPartner from '../../components/Manager/AddGrowthPartner';

class JoinAsGrowthPartner extends React.PureComponent {
  render() {
    const {
      growthPartnerFormData,
      formErrors,
      growthPartnerChange,
      addGrowthPartner,
      isSubmitting,
      isLoading
    } = this.props;

    return (
      <div className='join-as-growth-partner'>
        {isLoading && <LoadingIndicator />}
        <h3 className='text-uppercase'>Become a Growth Partner!</h3>
        <hr />
        <Row>
          <Col xs='12' md='6' className='order-2 order-md-1'>
            <AddGrowthPartner
              growthPartnerFormData={growthPartnerFormData}
              formErrors={formErrors}
              isSubmitting={isSubmitting}
              submitTitle='Submit'
              growthPartnerChange={growthPartnerChange}
              addGrowthPartner={addGrowthPartner}
            />
          </Col>
          <Col xs='12' md='6' className='order-1 order-md-2'>
            <Row>
              <Col xs='12' className='order-2 order-md-1 text-md-center mb-3'>
                <div className='agreement-banner-text'>
                  <h3>Join as a Growth Partner!</h3>
                  <h5>Help us expand and earn rewards</h5>
                  <b>Apply Today</b>
                </div>
              </Col>

              <Col
                xs='12'
                className='order-1 order-md-2 text-center mb-3 mb-md-0'
              >
                <img
                  className='agreement-banner'
                  src={'/images/banners/agreement.svg'}
                  alt='agreement banner'
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    growthPartnerFormData: state.growthPartner.growthPartnerFormData,
    formErrors: state.growthPartner.formErrors,
    isSubmitting: state.growthPartner.isSubmitting,
    isLoading: state.growthPartner.isLoading
  };
};

export default connect(mapStateToProps, actions)(JoinAsGrowthPartner);
