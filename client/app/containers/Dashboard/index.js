// /**
//  *
//  * Dashboard
//  *
//  */

// import React from 'react';

// import { connect } from 'react-redux';

// import actions from '../../actions';
// import { ROLES } from '../../constants';
// import dashboardLinks from './links.json';
// import { isDisabledMerchantAccount } from '../../utils/app';
// import Admin from '../../components/Manager/Dashboard/Admin';
// import Merchant from '../../components/Manager/Dashboard/Merchant';
// import Customer from '../../components/Manager/Dashboard/Customer';
// import DisabledMerchantAccount from '../../components/Manager/DisabledAccount/Merchant';
// import LoadingIndicator from '../../components/Common/LoadingIndicator';

// class Dashboard extends React.PureComponent {
//   componentDidMount() {
//     this.props.fetchProfile();
//   }

//   render() {
//     const { user, isLoading, isMenuOpen, toggleDashboardMenu } = this.props;

//     if (isDisabledMerchantAccount(user))
//       return <DisabledMerchantAccount user={user} />;

//     return (
//       <>
//         {isLoading ? (
//           <LoadingIndicator inline />
//         ) : user.role === ROLES.Admin ? (
//           <Admin
//             user={user}
//             isMenuOpen={isMenuOpen}
//             links={dashboardLinks[ROLES.Admin]}
//             toggleMenu={toggleDashboardMenu}
//           />
//         ) : user.role === ROLES.Merchant && user.merchant ? (
//           <Merchant
//             user={user}
//             isMenuOpen={isMenuOpen}
//             links={dashboardLinks[ROLES.Merchant]}
//             toggleMenu={toggleDashboardMenu}
//           />
//         ) : (
//           <Customer
//             user={user}
//             isMenuOpen={isMenuOpen}
//             links={dashboardLinks[ROLES.Member]}
//             toggleMenu={toggleDashboardMenu}
//           />
//         )}
//       </>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     user: state.account.user,
//     isLoading: state.account.isLoading,
//     isMenuOpen: state.dashboard.isMenuOpen
//   };
// };

// export default connect(mapStateToProps, actions)(Dashboard);
 

/**
 *
 * Dashboard
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';
import dashboardLinks from './links.json';
import { isDisabledMerchantAccount } from '../../utils/app';
import Admin from '../../components/Manager/Dashboard/Admin';
import Merchant_dashboard from '../../components/Manager/Dashboard/Merchant';
import Customer from '../../components/Manager/Dashboard/Customer';
import GrowthPartner from '../../components/Manager/Dashboard/GrowthPartner'; // ✅ NEW
import DisabledMerchantAccount from '../../components/Manager/DisabledAccount/Merchant';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Dashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProfile();
  }

  render() {
    const { user, isLoading, isMenuOpen, toggleDashboardMenu } = this.props;

    if (isDisabledMerchantAccount(user))
      return <DisabledMerchantAccount user={user} />;

    return (
      <>
        {isLoading ? (
          <LoadingIndicator inline />
        ) : user.role === ROLES.Admin ? (
          <Admin
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Admin]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : user.role === ROLES.Merchant  ? (
          <Merchant_dashboard
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Merchant]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : user.role === ROLES.GrowthPartner  ? ( // ✅ Growth Partner check
          <GrowthPartner
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.GrowthPartner]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : (
          <Customer
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Member]}
            toggleMenu={toggleDashboardMenu}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen
  };
};

export default connect(mapStateToProps, actions)(Dashboard);
