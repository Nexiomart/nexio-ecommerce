/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { calculateDiscountedPrice } from '../../../utils/price';

const ProductList = props => {
  const { products } = props;

  return (
    <div className='p-list'>
      {products.map((product, index) => (
        <Link
          to={`/dashboard/product/edit/${product._id}`}
          key={index}
          className='d-flex flex-row align-items-center mx-0 mb-3 product-box'
        >
          <img
            className='item-image'
            src={`${
              product && product.imageUrl
                ? product.imageUrl
                : '/images/placeholder-image.png'
            }`}
          />
          <div className='d-flex flex-column justify-content-center px-3 text-truncate'>
            <h4 className='text-truncate'>{product.name}</h4>
            <p className='mb-2 text-truncate'>{product.description}</p>
            <div className='price-info'>
              {product.discount > 0 ? (
                <div>
                  <span className='text-success font-weight-bold'>
                    ₹{calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
                  </span>
                  <span className='text-muted ml-2' style={{ textDecoration: 'line-through', fontSize: '0.9em' }}>
                    ₹{product.price}
                  </span>
                  <span className='badge badge-danger ml-2'>{product.discount}% OFF</span>
                </div>
              ) : (
                <span className='font-weight-bold'>₹{product.price}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
