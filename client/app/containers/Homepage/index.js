/**
 *
 * Homepage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ProductSection from '../../components/Store/ProductSection';

import './style.scss';

class Homepage extends React.PureComponent {
  componentDidMount() {
    const { fetchTopDiscountedProducts, fetchLatestProducts } = this.props;
    fetchTopDiscountedProducts(6);
    fetchLatestProducts(6);
  }

  render() {
    const { topDiscountedProducts, latestProducts, isLoading } = this.props;

    return (
      <div className='homepage'>
        {/* Hero Section */}
        <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-5.jpg' />
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-6.jpg' />
            </div>
          </Col>
        </Row>

        {/* Top Discounted Products Section */}
        <ProductSection
          title="🔥 Mega Deals & Discounts"
          products={topDiscountedProducts}
          viewAllLink="/shop?sortBy=discount"
          viewAllText="Explore All Deals"
          emptyMessage="Amazing deals coming soon! Stay tuned for incredible discounts."
          className="top-discounted-section"
          isLoading={isLoading}
        />

        {/* Latest Products Section */}
        <ProductSection
          title="✨ Fresh Arrivals"
          products={latestProducts}
          viewAllLink="/shop?sortBy=newest"
          viewAllText="Discover More"
          emptyMessage="New products are on their way! Check back soon for the latest additions."
          className="latest-products-section"
          isLoading={isLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    topDiscountedProducts: state.product.topDiscountedProducts,
    latestProducts: state.product.latestProducts,
    isLoading: state.product.isLoading
  };
};

export default connect(mapStateToProps, actions)(Homepage);
