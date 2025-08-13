/**
 *
 * SubscriptionModal
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Row, Col, Button } from 'reactstrap';

import actions from '../../../actions';
import SubscriptionPlanCard from '../SubscriptionPlanCard';
import PaymentForm from '../PaymentForm';
import LoadingIndicator from '../LoadingIndicator';

import './style.scss';

class SubscriptionModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 1, // 1: Plan Selection, 2: Payment
      referralCode: ''
    };
  }

  componentDidMount() {
    // Check if there's a referral code in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      this.setState({ referralCode });
    }
  }

  handlePlanSelect = (plan) => {
    const { setSelectedPlan } = this.props;
    setSelectedPlan(plan);
    this.setState({ step: 2 });
  };

  handleBackToPlans = () => {
    this.setState({ step: 1 });
  };

  handlePaymentSubmit = (paymentData) => {
    const { selectedPlan, createSubscription } = this.props;
    const { referralCode } = this.state;

    const subscriptionData = {
      planId: selectedPlan._id,
      referredBy: referralCode || null,
      paymentDetails: paymentData
    };

    createSubscription(subscriptionData);
  };

  getModalTitle = () => {
    const { modalStakeholder, authenticated } = this.props;
    const { step } = this.state;

    if (step === 1) {
      return `Choose Your ${modalStakeholder} Plan`;
    } else {
      const action = authenticated ? 'Upgrade Your Account' : 'Complete Your Registration';
      return action;
    }
  };

  getStakeholderDisplayName = (stakeholder) => {
    switch (stakeholder) {
      case 'Manufacturer':
        return 'Manufacturer';
      case 'Retailers':
        return 'Retailer';
      case 'Other Growth Partner':
        return 'Growth Partner';
      default:
        return stakeholder;
    }
  };

  render() {
    const {
      isModalOpen,
      modalStakeholder,
      subscriptionPlans,
      selectedPlan,
      isLoading,
      toggleSubscriptionModal,
      authenticated,
      user
    } = this.props;
    const { step, referralCode } = this.state;

    if (!modalStakeholder) return null;

    return (
      <Modal
        isOpen={isModalOpen}
        toggle={() => toggleSubscriptionModal(false)}
        className="subscription-modal"
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={() => toggleSubscriptionModal(false)}>
          <div className="modal-title-container">
            <h3>{this.getModalTitle()}</h3>
            <p className="modal-subtitle">
              Join as a {this.getStakeholderDisplayName(modalStakeholder)} and unlock premium features
            </p>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {isLoading ? (
            <div className="text-center py-5">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="plan-selection-step">
                  <div className="subscription-intro mb-4">
                    <p className="text-center">
                      {authenticated
                        ? `Upgrade your account to become a ${this.getStakeholderDisplayName(modalStakeholder)} and unlock premium features`
                        : `Join as a ${this.getStakeholderDisplayName(modalStakeholder)} and unlock premium features`
                      }
                    </p>
                    {authenticated && (
                      <div className="alert alert-success text-center">
                        <small>
                          <i className="fa fa-user mr-2"></i>
                          Logged in as: <strong>{user?.email}</strong>
                        </small>
                      </div>
                    )}
                  </div>

                  {referralCode && (
                    <div className="referral-info mb-4">
                      <div className="alert alert-info">
                        <i className="fa fa-gift mr-2"></i>
                        You're joining through a referral! Code: <strong>{referralCode}</strong>
                      </div>
                    </div>
                  )}
                  
                  <Row>
                    {subscriptionPlans.map((plan, index) => (
                      <Col key={plan._id} md="4" className="mb-4">
                        <SubscriptionPlanCard
                          plan={plan}
                          onSelect={() => this.handlePlanSelect(plan)}
                          isPopular={index === 1} // Make middle plan popular
                        />
                      </Col>
                    ))}
                  </Row>
                  
                  {subscriptionPlans.length === 0 && (
                    <div className="text-center py-5">
                      <p>No subscription plans available for {modalStakeholder} at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && selectedPlan && (
                <div className="payment-step">
                  <div className="selected-plan-summary mb-4">
                    <h5>Selected Plan: {selectedPlan.modelName}</h5>
                    <div className="plan-details">
                      <div className="price-breakdown">
                        <div className="d-flex justify-content-between">
                          <span>Subscription Fee:</span>
                          <span>₹{selectedPlan.subscriptionFeePerYear}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>GST:</span>
                          <span>₹{selectedPlan.gst}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between font-weight-bold">
                          <span>Total Amount:</span>
                          <span>₹{selectedPlan.subscriptionAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <PaymentForm
                    amount={selectedPlan.subscriptionAmount}
                    onSubmit={this.handlePaymentSubmit}
                    onBack={this.handleBackToPlans}
                  />
                </div>
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    isModalOpen: state.subscription.isModalOpen,
    modalStakeholder: state.subscription.modalStakeholder,
    subscriptionPlans: state.subscription.subscriptionPlans,
    selectedPlan: state.subscription.selectedPlan,
    isLoading: state.subscription.isLoading,
    authenticated: state.authentication.authenticated,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(SubscriptionModal);
