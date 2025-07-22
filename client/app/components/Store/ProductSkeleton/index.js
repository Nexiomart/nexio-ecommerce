/**
 *
 * ProductSkeleton
 *
 */

import React from 'react';
import './style.scss';

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="skeleton-description">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="skeleton-description short">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="skeleton-price">
          <div className="skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-2-4 mb-4">
          <ProductSkeleton />
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
export { ProductSkeletonGrid };
