/* Privacy Policy - Nexiomart (India) */

import React from 'react';

import './style.scss';

class PrivacyPolicy extends React.PureComponent {
  componentDidMount() {
    document.title = 'Privacy Policy | Nexiomart';
    this.setMeta('description', 'Nexiomart\'s Privacy Policy explains how we collect, use, store, and share data across our B2B and B2C marketplace, and your rights under Indian data protection laws.');
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
          <h1 className='policy-title'>Privacy Policy</h1>
          <p className='policy-meta'>Last updated: {new Date().getFullYear()}</p>

          <p>
            This Privacy Policy describes how Nexiomart ("we", "us", "our") collects, uses, stores,
            and shares information when you access or use our e-commerce platform connecting
            manufacturers, retailers/distributors, and consumers in India. We process personal data in
            accordance with the Information Technology Act, 2000, the SPDI Rules, 2011, and the Digital
            Personal Data Protection Act, 2023 ("DPDP Act").
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>Account & Profile: name, email, phone, address, business details (GSTIN, PAN), and role
              (manufacturer, retailer/distributor, consumer, growth partner).</li>
            <li>Transaction & Logistics: orders, invoices, payment method details (tokenized), shipment
              addresses, delivery preferences.</li>
            <li>Usage & Device: IP address, device identifiers, browser type, pages visited, cookies,
              and analytics events.</li>
            <li>Communications: support tickets, feedback, surveys, and communications with sellers/buyers.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Account creation, authentication, and customer support.</li>
            <li>Order processing, payments, shipping coordination, and fraud prevention.</li>
            <li>Personalizing content, recommendations, and marketing (with consent where required).</li>
            <li>Compliance with legal obligations (tax, KYC, audit), and enforcing our Terms.</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <ul>
            <li>With sellers/buyers and logistics partners to fulfill transactions.</li>
            <li>With payment gateways, KYC providers, analytics, and cloud hosting vendors under appropriate
              contracts and safeguards.</li>
            <li>With authorities when legally required or to protect rights, safety, and integrity.</li>
          </ul>

          <h2>4. Cookies and Similar Technologies</h2>
          <p>
            We use cookies, web beacons, and similar technologies to remember preferences, keep you logged in,
            analyze site usage, and deliver relevant content. You may block cookies via browser settings, but
            some features may not function properly.
          </p>

          <h2>5. Data Retention and Security</h2>
          <p>
            We retain data for as long as necessary to provide services and comply with legal obligations.
            We implement reasonable technical and organizational measures to protect data against
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>6. Your Rights</h2>
          <ul>
            <li>Access, correction, and deletion of your personal data (subject to applicable law).</li>
            <li>Withdraw consent for processing where consent is the legal basis.</li>
            <li>Opt out of marketing communications.</li>
          </ul>

          <h2>7. Children</h2>
          <p>
            The Platform is not intended for individuals under 18. We do not knowingly collect data from
            minors without appropriate consent/authorization under applicable laws.
          </p>

          <h2>8. International Transfers</h2>
          <p>
            Data may be processed outside India with adequate safeguards and in compliance with the DPDP
            Act and other applicable regulations.
          </p>

          <h2>9. Updates to This Policy</h2>
          <p>
            We may update this Policy from time to time. Material changes will be notified via the Platform
            or email. Continued use signifies acceptance of the updated Policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            You can reach our Data Protection contact at
            <a href='mailto:Partnerships@nexiomart.com'> Partnerships@nexiomart.com </a>.
          </p>
        </div>
      </div>
    );
  }
}

export default PrivacyPolicy;

