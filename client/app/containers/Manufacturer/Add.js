/* Manufacturer Add */

import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import AddMerchant from '../../components/Manager/AddMerchant';

class Add extends React.PureComponent {
  render() {
    const { history, manufacturerFormData, formErrors, isSubmitting, manufacturerChange, addManufacturer } = this.props;

    return (
      <SubPage title='Add Manufacturer' actionTitle='Cancel' handleAction={() => history.goBack()}>
        {/* Commented out for manufacturer forms: showReferralField={false} */}
        <AddMerchant
          merchantFormData={manufacturerFormData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          submitTitle='Add Manufacturer'
          merchantChange={manufacturerChange}
          addMerchant={() => addManufacturer()}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => ({
  manufacturerFormData: state.manufacturer.manufacturerFormData,
  formErrors: state.manufacturer.formErrors,
  isSubmitting: state.manufacturer.isSubmitting
});

export default connect(mapStateToProps, actions)(Add);

