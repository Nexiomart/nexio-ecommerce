/* Returns Policy - Nexiomart */

import React from 'react';

import './style.scss';

class ReturnsPolicy extends React.PureComponent {
  componentDidMount() {
    document.title = 'Returns Policy | Nexiomart';
    this.setMeta('description', 'Nexiomart Returns Policy: eligibility, timeframes, process, refunds, and exceptions by product category for our B2B and B2C marketplace.');
  }

  setMeta(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  render() {
    return (
      <div className='policy-page'>
        <div className='policy-card'>
          <h1 className='policy-title'>Returns & Refunds Policy</h1>
          <p className='policy-meta'>Last updated: {new Date().getFullYear()}</p>

          <h2>1. Overview</h2>
          <p>
            This Returns Policy applies to purchases made on Nexiomart by consumers and retailers/distributors.
            Eligibility and timelines may vary by product category and delivery model (manufacturer-/merchant-
            fulfilled or Nexiomart-coordinated).
          </p>

          <h2>2. Return Eligibility</h2>
          <ul>
            <li>Eligible returns include items received damaged, defective, or not as described.</li>
            <li>Items must be unused, in original packaging with all accessories, manuals, and tags.</li>
            <li>Serial-numbered or tamper-evident products must remain intact.</li>
          </ul>

          <h2>3. Timeframes</h2>
          <ul>
            <li>Consumer orders: 7–10 days from delivery for most categories unless otherwise specified.</li>
            <li>B2B/bulk orders: Return windows are communicated at quotation/checkout and may require
              DOA (dead-on-arrival) reporting within 48 hours.</li>
          </ul>

          <h2>4. Non-Returnable/Exceptions</h2>
          <ul>
            <li>Personal care, perishable goods, custom-made items, downloadable software, opened hygiene
              products, and items explicitly marked non-returnable.</li>
            <li>Consumables (inks, toners, filters) if opened/used, unless defective on arrival.</li>
            <li>Products with altered/removed serial numbers, or damaged due to misuse or unauthorized repairs.</li>
          </ul>

          <h2>5. Return Process</h2>
          <ol>
            <li>Initiate a return request from your order history or contact support with order details and
              evidence (photos/videos).</li>
            <li>Receive RMA instructions and pickup/shipping details.</li>
            <li>Pack securely with all accessories; use the provided label where applicable.</li>
            <li>Inspection at the seller/service center determines approval for replacement/refund.</li>
          </ol>

          <h2>6. Refunds and Replacements</h2>
          <ul>
            <li>Approved refunds are processed to the original payment method or store credit, typically within
              5–10 business days after inspection completion.</li>
            <li>Replacement is subject to stock availability; otherwise a refund is issued.</li>
          </ul>

          <h2>7. Shipping Costs for Returns</h2>
          <ul>
            <li>If the return is due to our error (damaged/defective/incorrect item), return shipping is covered.</li>
            <li>For other returns, shipping and restocking fees may apply where permitted and disclosed.</li>
          </ul>

          <h2>8. Warranty and Service</h2>
          <p>
            Products may carry manufacturer warranty; service will be as per manufacturer terms. Warranty claims
            may be routed to authorized service centers.
          </p>

          <h2>9. Contact</h2>
          <p>
            For return assistance, contact <a href='mailto:Partnerships@nexiomart.com'>Partnerships@nexiomart.com</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default ReturnsPolicy;

