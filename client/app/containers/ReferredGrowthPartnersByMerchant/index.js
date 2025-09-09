/*
 * Referred Growth Partners by Merchant (for Merchant dashboard)
 */

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import actions from '../../actions';
import { API_URL } from '../../constants';

import SubPage from '../../components/Manager/SubPage';
import GrowthPartnerList from '../../components/Manager/GrowthPartnerList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class ReferredGrowthPartnersByMerchant extends React.PureComponent {
  state = { isLoading: true, partners: [], error: null };

  async componentDidMount() {
    try {
      const res = await axios.get(`${API_URL}/merchant/referred-growthpartners`);
      const partners = res.data.growthpartners || res.data.partners || [];
      this.setState({ partners, isLoading: false });
    } catch (error) {
      this.setState({ error: 'Could not load referred growth partners.', isLoading: false });
    }
  }

  render() {
    const { partners, isLoading, error } = this.state;

    return (
      <div className="referred-growth-partners-by-merchant">
        <SubPage title={"Referred Growth Partners"} isMenuOpen={null}>
          {isLoading && (
            <div className="text-center py-5"><LoadingIndicator /></div>
          )}

          {!isLoading && error && (
            <div className="alert alert-danger" role="alert">{error}</div>
          )}

          {!isLoading && !error && partners.length > 0 && (
            <>
              <div className="mb-3">
                <small className="text-muted">Total referred: {partners.length}</small>
              </div>
              {/* Read-only usage of GrowthPartnerList */}
              <GrowthPartnerList growthPartners={partners} />
            </>
          )}

          {!isLoading && !error && partners.length === 0 && (
            <NotFound message="No referred growth partners yet." />
          )}
        </SubPage>
      </div>
    );
  }
}

export default connect(null, actions)(ReferredGrowthPartnersByMerchant);

