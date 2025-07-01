// /*
//  *
//  * GrowthPartner List
//  *
//  */

// import React from 'react';

// import { connect } from 'react-redux';

// import actions from '../../actions';
// import { ROLES } from '../../constants';

// import SubPage from '../../components/Manager/SubPage';
// import GrowthPartnerList from '../../components/Manager/GrowthPartnerList';
// import GrowthPartnerSearch from '../../components/Manager/GrowthPartnerSearch';
// import SearchResultMeta from '../../components/Manager/SearchResultMeta';
// import LoadingIndicator from '../../components/Common/LoadingIndicator';
// import NotFound from '../../components/Common/NotFound';
// import Pagination from '../../components/Common/Pagination';

// class List extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       search: ''
//     };
//   }

//   componentDidMount() {
//     this.props.fetchGrowthPartners();
//   }

//   handleGrowthPartnerSearch = e => {
//     if (e.value.length >= 2) {
//       this.props.searchGrowthPartners({ name: 'growth-partner', value: e.value });
//       this.setState({ search: e.value });
//     } else {
//       this.setState({ search: '' });
//     }
//   };

//   handleOnPagination = (n, v) => {
//     this.props.fetchGrowthPartners(v);
//   };

//   render() {
//     const {
//       history,
//       user,
//       growthPartners,
//       isLoading,
//       searchedGrowthPartners,
//       advancedFilters,
//       fetchGrowthPartners,
//       approveGrowthPartner,
//       rejectGrowthPartner,
//       deleteGrowthPartner,
//       disableGrowthPartner,
//       searchGrowthPartners
//     } = this.props;

//     const { search } = this.state;
//     const isSearch = search.length > 0;
//     const filteredPartners = search ? searchedGrowthPartners : growthPartners;
//     const displayPagination = advancedFilters.totalPages > 1;
//     const displayPartners = filteredPartners && filteredPartners.length > 0;

//     return (
//       <div className='growth-partner-dashboard'>
//         <SubPage
//           title={'Growth Partners'}
//           actionTitle={user.role === ROLES.Admin && 'Add'}
//           handleAction={() => history.push('/dashboard/growthpartner/add')}
//         />
//         <GrowthPartnerSearch
//           onSearch={this.handleGrowthPartnerSearch}
//           onSearchSubmit={searchGrowthPartners}
//         />
//         {isLoading && <LoadingIndicator />}
//         {displayPartners && (
//           <>
//             {!isSearch && displayPagination && (
//               <Pagination
//                 totalPages={advancedFilters.totalPages}
//                 onPagination={fetchGrowthPartners}
//               />
//             )}
//             <SearchResultMeta
//               label='growth partners'
//               count={isSearch ? filteredPartners.length : advancedFilters.count}
//             />
//             <GrowthPartnerList
//               growthPartners={filteredPartners}
//               approveGrowthPartner={p =>
//                 approveGrowthPartner(p, search, advancedFilters.currentPage)
//               }
//               rejectGrowthPartner={p =>
//                 rejectGrowthPartner(p, search, advancedFilters.currentPage)
//               }
//               deleteGrowthPartner={p =>
//                 deleteGrowthPartner(p, search, advancedFilters.currentPage)
//               }
//               disableGrowthPartner={(p, v) =>
//                 disableGrowthPartner(p, v, search, advancedFilters.currentPage)
//               }
//             />
//           </>
//         )}
//         {!isLoading && !displayPartners && (
//           <NotFound message='No growth partners found.' />
//         )}
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     growthPartners: state.growthPartner.growthPartners,
//     advancedFilters: state.growthPartner.advancedFilters,
//     isLoading: state.growthPartner.isLoading,
//     searchedGrowthPartners: state.growthPartner.searchedGrowthPartners,
//     user: state.account.user
//   };
// };

// export default connect(mapStateToProps, actions)(List);


/*
 *
 * GrowthPartner List
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';

import SubPage from '../../components/Manager/SubPage';
import GrowthPartnerList from '../../components/Manager/GrowthPartnerList';
import GrowthPartnerSearch from '../../components/Manager/GrowthPartnerSearch';
import SearchResultMeta from '../../components/Manager/SearchResultMeta';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import Pagination from '../../components/Common/Pagination';

class List extends React.PureComponent {
  state = {
    search: ''
  };

  componentDidMount() {
    this.props.fetchGrowthPartners();
  }

  handleGrowthPartnerSearch = e => {
    if (e.value.length >= 2) {
      this.props.searchGrowthPartners({ name: 'growthpartner', value: e.value });
      this.setState({ search: e.value });
    } else {
      this.setState({ search: '' });
    }
  };

  render() {
    const {
      history,
      user,
      growthPartners,
      isLoading,
      searchedGrowthPartners,
      advancedFilters,
      fetchGrowthPartners,
      approveGrowthPartner,
      rejectGrowthPartner,
      deleteGrowthPartner,
      disableGrowthPartner,
      searchGrowthPartners
    } = this.props;

    const { search } = this.state;
    const isSearch = search.length > 0;
    const filteredPartners = isSearch ? searchedGrowthPartners : growthPartners;
    const displayPagination = !isSearch && advancedFilters.totalPages > 1;
    const displayPartners = filteredPartners && filteredPartners.length > 0;

    return (
      <div className='growth-partner-dashboard'>
        <SubPage
          title='Growth Partners'
          actionTitle={user.role === ROLES.Admin && 'Add'}
          handleAction={() => history.push('/dashboard/growthpartner/add')}
        />

        <GrowthPartnerSearch
          onSearch={this.handleGrowthPartnerSearch}
          onSearchSubmit={searchGrowthPartners}
        />

        {isLoading && <LoadingIndicator />}

        {displayPartners && (
          <>
            {displayPagination && (
              <Pagination
                totalPages={advancedFilters.totalPages}
                onPagination={fetchGrowthPartners}
              />
            )}

            <SearchResultMeta
              label='growth partners'
              count={isSearch ? filteredPartners.length : advancedFilters.count}
            />

            <GrowthPartnerList
              growthPartners={filteredPartners}
              approveGrowthPartner={p =>
                approveGrowthPartner(p, search, advancedFilters.currentPage)
              }
              rejectGrowthPartner={p =>
                rejectGrowthPartner(p, search, advancedFilters.currentPage)
              }
              deleteGrowthPartner={p =>
                deleteGrowthPartner(p, search, advancedFilters.currentPage)
              }
              disableGrowthPartner={(p, v) =>
                disableGrowthPartner(p, v, search, advancedFilters.currentPage)
              }
            />
          </>
        )}

        {!isLoading && !displayPartners && (
          <NotFound message='No growth partners found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  growthPartners: state.growthPartner.growthPartners,
  searchedGrowthPartners: state.growthPartner.searchedGrowthPartners,
  advancedFilters: state.growthPartner.advancedFilters,
  isLoading: state.growthPartner.isLoading,
  user: state.account.user
});

export default connect(mapStateToProps, actions)(List);
