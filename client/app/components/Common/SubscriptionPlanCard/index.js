/**
 *
 * SubscriptionPlanCard
 *
 */

import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';

import './style.scss';

const SubscriptionPlanCard = ({ plan, onSelect, isPopular = false }) => {
  return (
    <Card className={`subscription-plan-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && (
        <div className="popular-badge">
          <span>Most Popular</span>
        </div>
      )}
      
      <CardBody>
        <div className="plan-header">
          <h4 className="plan-name">{plan.modelName}</h4>
          <p className="plan-description">{plan.description}</p>
        </div>

        <div className="plan-pricing">
          <div className="price-main">
            <span className="currency">₹</span>
            <span className="amount">{plan.subscriptionAmount.toLocaleString()}</span>
            <span className="period">/year</span>
          </div>
          
          <div className="price-breakdown">
            <small>Base: ₹{plan.subscriptionFeePerYear.toLocaleString()}</small>
            <small>GST: ₹{plan.gst.toLocaleString()}</small>
          </div>
        </div>

        <div className="plan-features">
          <h6>Features Included:</h6>
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>
                <i className="fa fa-check text-success mr-2"></i>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {plan.growthPartnerCommission > 0 && (
          <div className="commission-info">
            <div className="commission-badge">
              <i className="fa fa-gift mr-1"></i>
              ₹{plan.growthPartnerCommission} referral bonus
            </div>
          </div>
        )}

        <Button
          color={isPopular ? "primary" : "outline-primary"}
          size="lg"
          block
          onClick={onSelect}
          className="select-plan-btn"
        >
          Choose {plan.modelName}
        </Button>
      </CardBody>
    </Card>
  );
};

export default SubscriptionPlanCard;
