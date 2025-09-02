/* Manufacturer List */

import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import MerchantList from '../../components/Manager/MerchantList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import Pagination from '../../components/Common/Pagination';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchManufacturers();
  }

  render() {
    const { history, manufacturers, isLoading, advancedFilters, approveManufacturer, rejectManufacturer, deleteManufacturer, disableManufacturer } = this.props;

    const displayManufacturers = manufacturers && manufacturers.length;

    return (
      <div className='manufacturer-dashboard'>
        <SubPage title={'Manufacturers'}>
          {isLoading && <LoadingIndicator />}
          {displayManufacturers ? (
            <>
              <Pagination totalPages={advancedFilters.totalPages} onPagination={this.props.fetchManufacturers} />
              <MerchantList
                merchants={manufacturers}
                approveMerchant={approveManufacturer}
                rejectMerchant={rejectManufacturer}
                deleteMerchant={deleteManufacturer}
                disableMerchant={disableManufacturer}
              />
            </>
          ) : (
            <NotFound message='No manufacturers found.' />
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  manufacturers: state.manufacturer.manufacturers,
  isLoading: state.manufacturer.isLoading,
  advancedFilters: state.manufacturer.advancedFilters
});

export default connect(mapStateToProps, actions)(List);

