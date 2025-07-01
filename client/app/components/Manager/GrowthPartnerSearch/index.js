/**
 *
 * GrowthPartnerSearch
 *
 */

import React from 'react';

import SearchBar from '../../Common/SearchBar';

const GrowthPartnerSearch = props => {
  return (
    <div className='mb-3'>
      <SearchBar
        name='growthpartner'
        placeholder='Type email, phone number, brand or status'
        btnText='Search'
        onSearch={props.onSearch}
        onBlur={props.onBlur}
        onSearchSubmit={props.onSearchSubmit}
      />
    </div>
  );
};

export default GrowthPartnerSearch;
