/**
 *
 * ProductSection
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import ProductCard from '../ProductCard';
import { ProductSkeletonGrid } from '../ProductSkeleton';

import './style.scss';

const ProductSection = props => {
  const {
    title,
    products,
    viewAllLink,
    viewAllText = 'View All',
    emptyMessage = 'No products available',
    className = '',
    isLoading = false
  } = props;

  if (!products || products.length === 0) {
    return (
      <div className={`product-section ${className}`}>
        <Container>
          <Row>
            <Col>
              <div className='section-header'>
                <h2 className='section-title'>{title}</h2>
              </div>
              <div className='empty-section'>
                <p>{emptyMessage}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className={`product-section ${className}`}>
      <Container>
        <Row>
          <Col>
            <div className='section-header'>
              <h2 className='section-title'>{title}</h2>
              {viewAllLink && (
                <Link to={viewAllLink} className='view-all-link'>
                  {viewAllText} →
                </Link>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          {isLoading ? (
            <ProductSkeletonGrid count={5} />
          ) : (
            products.map((product, index) => (
              <Col key={product._id || index} xs='12' sm='6' md='4' lg='2-4' className='mb-4'>
                <ProductCard product={product} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ProductSection;
