// /*
//  *
//  * Add Growth Partner
//  *
//  */

// import React from 'react';

// import { connect } from 'react-redux';

// import actions from '../../actions';

// import SubPage from '../../components/Manager/SubPage';
// import AddGrowthPartner from '../../components/Manager/AddGrowthPartner';

// class Add extends React.PureComponent {
//   render() {
//     const {
//       history,
//       growthPartnerFormData,
//       formErrors,
//       isSubmitting,
//       growthPartnerChange,
//       addGrowthPartner
//     } = this.props;

//     return (
//       <SubPage
//         title='Add Growth Partner'
//         actionTitle='Cancel'
//         handleAction={() => history.goBack()}
//       >
//         <AddGrowthPartner
//           growthPartnerFormData={growthPartnerFormData}
//           formErrors={formErrors}
//           isSubmitting={isSubmitting}
//           submitTitle='Add Growth Partner'
//           growthPartnerChange={growthPartnerChange}
//           addGrowthPartner={() => addGrowthPartner(true)}
//         />
//       </SubPage>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     growthPartnerFormData: state.growthPartner.growthPartnerFormData,
//     formErrors: state.growthPartner.formErrors,
//     isSubmitting: state.growthPartner.isSubmitting,
//     isLoading: state.growthPartner.isLoading
//   };
// };

// export default connect(mapStateToProps, actions)(Add);



/*
 *
 * Add Growth Partner
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import AddGrowthPartner from '../../components/Manager/AddGrowthPartner';

class Add extends React.PureComponent {
  render() {
    const {
      history,
      growthPartnerFormData,
      formErrors,
      isSubmitting,
      growthPartnerChange,
      addGrowthPartner
    } = this.props;

    return (
      <SubPage
        title='Add Growth Partner'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddGrowthPartner
          growthPartnerFormData={growthPartnerFormData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          submitTitle='Add Growth Partner'
          growthPartnerChange={growthPartnerChange}
          addGrowthPartner={() => {
            if (!isSubmitting) addGrowthPartner(true);
          }}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => ({
  growthPartnerFormData: state.growthPartner.growthPartnerFormData,
  formErrors: state.growthPartner.formErrors,
  isSubmitting: state.growthPartner.isSubmitting,
  isLoading: state.growthPartner.isLoading
});

export default connect(mapStateToProps, actions)(Add);
