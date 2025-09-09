/*
 * ReferredMerchants (for Merchant dashboard)
 */

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import actions from '../../actions';
import { API_URL } from '../../constants';

import SubPage from '../../components/Manager/SubPage';
import MerchantList from '../../components/Manager/MerchantList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class ReferredMerchants extends React.PureComponent {
  state = { isLoading: true, merchants: [], error: null };

  async componentDidMount() {
    try {
      const res = await axios.get(`${API_URL}/merchant/referred-merchants`);
      const merchants = res.data.merchants || [];
      this.setState({ merchants, isLoading: false });
    } catch (error) {
      this.setState({ error: 'Could not load referred merchants.', isLoading: false });
    }
  }

  render() {
    const { merchants, isLoading, error } = this.state;

    return (
      <div className="referred-merchants">
        <SubPage title={"Referred Merchants"} isMenuOpen={null}>
          {isLoading && (
            <div className="text-center py-5"><LoadingIndicator /></div>
          )}

          {!isLoading && error && (
            <div className="alert alert-danger" role="alert">{error}</div>
          )}

          {!isLoading && !error && merchants.length > 0 && (
            <>
              <div className="mb-3">
                <small className="text-muted">Total referred: {merchants.length}</small>
              </div>
              {/* Read-only usage of MerchantList (no action handlers passed) */}
              <MerchantList merchants={merchants} />
            </>
          )}

          {!isLoading && !error && merchants.length === 0 && (
            <NotFound message="No referred merchants yet." />
          )}
        </SubPage>
      </div>
    );
  }
}

export default connect(null, actions)(ReferredMerchants);

