/**
 *
 * ProductCard
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { calculateDiscountedPrice } from '../../../utils/price';

import './style.scss';

const ProductCard = props => {
  const { product, className = '' } = props;

  return (
    <div className={`product-card ${className}`}>
      <Link to={`/product/${product.slug}`} className='item-link'>
        <div className='item-image-container'>
          <div className='item-image-wrapper'>
            <img
              className='item-image'
              src={`${
                product.imageUrl
                  ? product.imageUrl
                  : '/images/placeholder-image.png'
              }`}
              alt={`${product.name}`}
            />
          </div>
          {product.discount > 0 && (
            <div className='discount-badge'>
              {product.discount}% OFF
            </div>
          )}
        </div>
        <div className='item-details'>
          <h4 className='item-name'>{product.name}</h4>
          <p className='item-desc'>{product.description}</p>
          <div className='item-price'>
            {product.discount > 0 ? (
              <div className='price-with-discount'>
                <span className='discounted-price'>
                  ₹{calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
                </span>
                <span className='original-price'>
                  ₹{product.price}
                </span>
                <span className='savings'>
                  Save ₹{(product.price - calculateDiscountedPrice(product.price, product.discount)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className='regular-price'>₹{product.price}</span>
            )}
          </div>
          {product.brand && (
            <div className='item-brand'>
              <small>by {product.brand.name}</small>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
