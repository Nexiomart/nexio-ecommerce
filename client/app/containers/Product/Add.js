/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';

import AddProduct from '../../components/Manager/AddProduct';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
  }

  componentDidUpdate(prevProps) {
    const { user, brands, productChange, productFormData } = this.props;

    // Auto-select first brand for merchants when brands are loaded
    if (
      user.role === ROLES.Merchant &&
      brands.length > 1 &&
      prevProps.brands.length !== brands.length &&
      (!productFormData.brand || productFormData.brand.value === 0)
    ) {
      // Select the first real brand (skip the "No option selected" at index 0)
      productChange('brand', brands[1]);
    }
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      brands,
      productChange,
      addProduct
    } = this.props;

    return (
      <SubPage
        title='Add Product'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddProduct
          user={user}
          productFormData={productFormData}
          formErrors={formErrors}
          brands={brands}
          productChange={productChange}
          addProduct={addProduct}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,
    brands: state.brand.brandsSelect
  };
};

export default connect(mapStateToProps, actions)(Add);
