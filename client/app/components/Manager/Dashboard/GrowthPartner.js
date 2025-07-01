/*
 *
 * GrowthPartner
 *
 */

import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import AccountMenu from '../AccountMenu';
import Page404 from '../../Common/Page404';

import Account from '../../../containers/Account';
import AccountSecurity from '../../../containers/AccountSecurity';
// import Referral from '../../../containers/Referral'; // Custom for Growth Partner
// import Leads from '../../../containers/Leads';       // Optional: e.g., merchants acquired
// import Commission from '../../../containers/Commission'; // Optional earnings view
import Address from '../../../containers/Address';
import Product from '../../../containers/Product';
import Brand from '../../../containers/Brand';
import Order from '../../../containers/Order';
import Wishlist from '../../../containers/WishList';

const GrowthPartner = props => {
  return (
    <div className='growth-partner'>
      <Row>
        <Col xs='12' md='5' xl='3'>
          <AccountMenu {...props} />
        </Col>
        <Col xs='12' md='7' xl='9'>
          <div className='panel-body'>
            <Switch>
              <Route exact path='/dashboard' component={Account} />
              <Route path='/dashboard/security' component={AccountSecurity} />
              <Route path='/dashboard/address' component={Address} />
              <Route path='/dashboard/product' component={Product} />
              <Route path='/dashboard/brand' component={Brand} />
              <Route path='/dashboard/orders' component={Order} />
              <Route path='/dashboard/wishlist' component={Wishlist} />
              {/* <Route path='/dashboard/referrals' component={Referral} />
              <Route path='/dashboard/leads' component={Leads} />
              <Route path='/dashboard/commission' component={Commission} /> */}
              <Route path='*' component={Page404} />
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GrowthPartner;
