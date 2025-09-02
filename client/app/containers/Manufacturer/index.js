/* Manufacturer index */

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';
import Add from './Add';
import List from './List';
import Page404 from '../../components/Common/Page404';

class Manufacturer extends React.PureComponent {
  render() {
    return (
      <div className='manufacturer-dashboard'>
        <Switch>
          <Route exact path='/dashboard/manufacturer' component={List} />
          <Route exact path='/dashboard/manufacturer/add' component={Add} />
          <Route path='*' component={Page404} />
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(Manufacturer);

