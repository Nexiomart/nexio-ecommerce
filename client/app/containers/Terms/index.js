/* Terms and Conditions - Nexiomart */

import React from 'react';

import './style.scss';

class TermsAndConditions extends React.PureComponent {
  componentDidMount() {
    document.title = 'Terms and Conditions | Nexiomart';
    this.setMeta('description', 'Read Nexiomart\'s Terms and Conditions governing the use of our B2B and B2C e-commerce platform for manufacturers, retailers/distributors, and consumers.');
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
          <h1 className='policy-title'>Terms and Conditions</h1>
          <p className='policy-meta'>Last updated: {new Date().getFullYear()}</p>

          <p>
            Welcome to Nexiomart, a B2B and B2C e-commerce platform connecting manufacturers (including
            OEM/ODMs), retailers/distributors, and end consumers. By accessing or using Nexiomart\'s
            website, apps, and related services (collectively, the "Platform"), you agree to these
            Terms and Conditions ("Terms"). If you do not agree, please do not use the Platform.
          </p>

          <h2>1. Eligibility and Account</h2>
          <ul>
            <li>You must be at least 18 years of age and capable of entering into a binding contract.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials and for all
              activities under your account.</li>
            <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
          </ul>

          <h2>2. Roles and Marketplace Model</h2>
          <p>
            Nexiomart facilitates transactions among: (a) Manufacturers listing products, (b) Retailers/
            distributors purchasing in bulk for resale, and (c) Consumers purchasing for personal use.
            Depending on the listing and transaction type, delivery may occur via manufacturer-fulfilled,
            merchant-fulfilled, or Nexiomart-coordinated logistics. Nexiomart may act as a marketplace
            intermediary and not as the seller of record in certain transactions.
          </p>

          <h2>3. Orders, Pricing, and Taxes</h2>
          <ul>
            <li>All prices, discounts, and offers are subject to change without notice. Taxes (e.g., GST) apply
              as per law and are shown during checkout.</li>
            <li>Orders are offers to purchase; acceptance occurs when we or the seller confirm dispatch or
              otherwise communicate acceptance.</li>
            <li>We may cancel orders for reasons including stock unavailability, pricing errors, suspected
              fraud, or regulatory restrictions. Refunds will be processed per the Returns Policy.</li>
          </ul>

          <h2>4. Payments</h2>
          <ul>
            <li>Payments are processed through approved gateways and methods. You authorize us to charge the
              selected payment instrument for the total amount shown at checkout.</li>
            <li>For B2B orders, additional verification (KYC/GST details, purchase orders) may be required.</li>
          </ul>

          <h2>5. Shipping and Delivery</h2>
          <p>
            Shipping timelines, charges, and risk transfer are governed by our Shipping Policy.
            Title and risk may pass to the buyer upon delivery to the carrier or upon physical delivery,
            depending on the delivery model and applicable law.
          </p>

          <h2>6. Returns and Refunds</h2>
          <p>
            Returns, replacements, and refunds are governed by our Returns Policy. Certain categories may be
            non-returnable or subject to inspection and restocking fees where permitted by law and seller policy.
          </p>

          <h2>7. Use of Platform and Prohibited Activities</h2>
          <ul>
            <li>Do not violate applicable laws, infringe intellectual property, or engage in fraudulent,
              deceptive, or harmful conduct.</li>
            <li>No scraping, reverse engineering, or interfering with the operation/security of the Platform.</li>
            <li>No listing or sale of prohibited/restricted items under applicable laws or Platform policies.</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <p>
            The Platform, including its content, design, logos, and trademarks, is owned by Nexiomart or its
            licensors. You are granted a limited, non-exclusive, non-transferable license to access and use the
            Platform for lawful purposes. User-generated content remains your responsibility and must not infringe
            third-party rights. You grant Nexiomart a worldwide, royalty-free license to host, display, and use
            such content solely to operate and promote the Platform.
          </p>

          <h2>9. Third-Party Services</h2>
          <p>
            We may link to or integrate third-party services (payments, logistics, analytics, etc.). We are not
            responsible for third-party content or practices. Your use of third-party services is governed by
            their terms and policies.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Platform and all products/services are provided on an "as is" and "as available" basis. To the
            fullest extent permitted by law, Nexiomart disclaims all warranties, express or implied, including
            merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the
            Platform will be uninterrupted, secure, or error-free, or that descriptions/pricing are accurate.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Nexiomart will not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill,
            arising out of or related to your use of the Platform. Our aggregate liability shall not exceed the
            amount paid by you for the product/service giving rise to the claim in the 3 months preceding the
            claim.
          </p>

          <h2>12. Indemnity</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Nexiomart, its affiliates, and their officers,
            directors, employees, and agents from claims arising out of your use of the Platform, breach of these
            Terms, or violation of law or third-party rights.
          </p>

          <h2>13. Suspension and Termination</h2>
          <p>
            We may suspend or terminate access to the Platform at any time for suspected abuse, non-compliance,
            or security risks. You may close your account subject to completion of any pending transactions and
            obligations.
          </p>

          <h2>14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of India. Courts at New Delhi shall have exclusive jurisdiction,
            subject to applicable arbitration/conciliation laws where mandated by contract or statute.
          </p>

          <h2>15. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Platform after updates constitutes
            acceptance of the revised Terms. Material changes will be communicated via the Platform or email.
          </p>

          <h2>16. Contact</h2>
          <p>
            For questions about these Terms, contact us at <a href='mailto:Partnerships@nexiomart.com'>Partnerships@nexiomart.com</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default TermsAndConditions;

