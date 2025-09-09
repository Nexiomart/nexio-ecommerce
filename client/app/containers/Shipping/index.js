/* Shipping Policy - Nexiomart */

import React from 'react';

import './style.scss';

class ShippingPolicy extends React.PureComponent {
  componentDidMount() {
    document.title = 'Shipping Policy | Nexiomart';
    this.setMeta('description', 'Nexiomart Shipping Policy: delivery models, processing times, shipping charges, packaging standards, delivery timelines, risk management, tracking, claims, and compliance.');
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
          <h1 className='policy-title'>Nexiomart Shipping & Delivery Policy</h1>
          <p className='policy-meta'>Last updated: {new Date().getFullYear()}</p>

          <p>
            At Nexiomart, we strive to ensure that all shipments are handled in a timely, safe, and transparent
            manner for both B2B (business-to-business) and B2C (business-to-consumer) transactions. This Shipping
            & Delivery Policy defines the complete process of order handling, packaging, shipping, delivery, and
            dispute resolution, while clarifying the roles, responsibilities, and liabilities of all parties involved
            — Nexiomart (platform), Manufacturers (OEMs), Retailers/Distributors, Logistics Partners, and End
            Consumers. By transacting through Nexiomart, all stakeholders agree to the terms of this Shipping &
            Delivery Policy.
          </p>

          <h2>1. Delivery Models</h2>
          <ul>
            <li><strong>Model A – Nexiomart / Logistics Partner Delivery:</strong> Nexiomart arranges delivery through its logistics
              tie-ups. Applicable for most B2C deliveries and some B2B shipments. Nexiomart ensures dispatch and
              tracking but liability for transit damages rests with the logistics partner (unless insured).</li>
            <li><strong>Model B – Manufacturer-Arranged Delivery (B2B):</strong> Manufacturer dispatches goods directly to
              retailers/distributors using their own logistics provider. Nexiomart only facilitates the order digitally and
              is not liable for transit delays/damages.</li>
            <li><strong>Model C – Retailer-Arranged Last-Mile Delivery (B2C):</strong> Retailer handles final delivery to the end
              consumer. Nexiomart’s responsibility ends once goods are successfully handed over to the retailer.</li>
          </ul>

          <h2>2. Order Processing</h2>
          <ul>
            <li>Orders are processed only after full payment confirmation (unless credit terms are separately agreed).</li>
            <li><strong>B2C Orders:</strong> Processed within 7–10 business days.</li>
            <li><strong>B2B Orders:</strong> Processed within 7–30 business days, subject to stock availability and documentation (GST, e-way bill).</li>
            <li><strong>Custom/Bulk Orders:</strong> 10–30 business days including production and packaging.</li>
            <li>Orders placed after 5:00 PM IST will be treated as next business day orders.</li>
          </ul>
          <p><em>Nexiomart is not liable for processing delays caused by incorrect documents, delayed payments, or manufacturer backlogs.</em></p>

          <h2>3. Shipping Coverage</h2>
          <ul>
            <li>Nexiomart delivers to all serviceable pin codes in India through its own tie-ups with logistics companies.</li>
            <li>Manufacturers may use their own logistics partners for B2B deliveries.</li>
            <li>Retailers may arrange local deliveries to consumers in Model C.</li>
            <li>For non-serviceable areas, deliveries will be routed to the nearest transport hub, and consignee will be responsible for pick-up.</li>
          </ul>

          <h2>4. Shipping Charges</h2>
          <ul>
            <li><strong>B2C (Model A or C):</strong>
              <ul>
                <li><strong>Free Shipping:</strong>
                  <ul>
                    <li>Free shipping, if applicable, will be clearly displayed at the time of order and will apply only to orders meeting specific conditions (e.g., minimum cart value, promotional offer, eligible products).</li>
                    <li>Free shipping cannot be claimed retroactively if not shown at checkout.</li>
                  </ul>
                </li>
                <li>Heavy, fragile, or oversized shipments may attract special handling charges regardless of promotions.</li>
              </ul>
              <p><em>Unless otherwise specified during checkout, shipping charges are always borne by the buyer/retailer.</em></p>
            </li>
            <li><strong>B2B (Model A or B):</strong>
              <ul>
                <li>Freight is on actuals (prepaid or freight-on-delivery).</li>
                <li>Packaging, palletization, warehousing, or insurance costs may be charged extra.</li>
              </ul>
              <p><em>Unless expressly agreed in writing, all shipping charges are borne by buyer/retailer.</em></p>
            </li>
          </ul>

          <h2>5. Packaging Standards</h2>
          <ul>
            <li><strong>Nexiomart:</strong> Uses tamper-proof, eco-friendly packaging for B2C orders and industrial-grade packaging for B2B orders.</li>
            <li><strong>Manufacturers:</strong> Responsible for safe, compliant packaging when dispatching directly.</li>
            <li><strong>Retailers:</strong> Must ensure adequate packaging for last-mile delivery.</li>
          </ul>
          <p><em>Nexiomart is not liable for damages caused by inadequate packaging by manufacturer or retailer.</em></p>

          <h2>6. Delivery Timelines</h2>
          <ul>
            <li><strong>B2C (Consumer Orders):</strong>
              <ul>
                <li>Metro Cities: 7–15 business days</li>
                <li>Tier-2/3: 5–15 business days</li>
                <li>Remote areas: 7–30 business days</li>
              </ul>
            </li>
            <li><strong>B2B (Bulk/Industrial Orders):</strong>
              <ul>
                <li>Industrial hubs: 5–20 business days</li>
                <li>Tier-2/3: 7–15 business days</li>
                <li>Heavy/bulk: 10–60 business days</li>
                <li>OEM/custom: 15–30 business days</li>
              </ul>
            </li>
          </ul>
          <p><em>Delivery timelines are indicative. Nexiomart is not liable for courier backlogs, strikes, weather delays, or force majeure.</em></p>

          <h2>7. Risk of Loss, Title & Insurance</h2>
          <ul>
            <li><strong>Model A (Nexiomart Logistics):</strong> Title passes to customer only upon delivery. Risk during transit rests with the logistics provider. Insurance may be purchased at extra cost.</li>
            <li><strong>Model B (Manufacturer Logistics):</strong> Title passes to retailer at dispatch (FOB terms). Manufacturer/logistics provider bears transit risk.</li>
            <li><strong>Model C (Retailer Logistics):</strong> Title passes to retailer at handover from manufacturer/Nexiomart. Retailers bear risk for last-mile delivery.</li>
          </ul>
          <p><em>Unless insurance is purchased, Nexiomart is not responsible for transit loss, theft, or damage.</em></p>

          <h2>8. Tracking & Proof of Delivery</h2>
          <ul>
            <li><strong>Model A:</strong> Nexiomart provides real-time tracking through its partner systems.</li>
            <li><strong>Model B:</strong> Manufacturer/logistics partner provides LR, challan, or tracking.</li>
            <li><strong>Model C:</strong> Retailer provides delivery updates to consumers.</li>
          </ul>
          <p>Proof of delivery (POD) shall be final evidence of completion of delivery.</p>

          <h2>9. Claims & Disputes</h2>
          <ul>
            <li><strong>B2C Orders:</strong> Consumers must report shortages/damages within 48 hours with photographs/video. Nexiomart will facilitate claims with logistics providers if Model A.</li>
            <li><strong>B2B Orders:</strong> Retailer must record discrepancies on POD and notify manufacturer/logistics provider within 24 hours.</li>
            <li><strong>Retailer Last-Mile:</strong> Consumer must contact retailer directly. Nexiomart will not entertain last-mile claims.</li>
          </ul>
          <p><em>Failure to report damages within the specified time will void claims. Nexiomart’s liability, if any, is limited to the invoice value of goods.</em></p>

          <h2>10. Customer / Retailer Responsibilities</h2>
          <ul>
            <li>Provide accurate shipping address, GSTIN (B2B), and contact details.</li>
            <li>Ensure availability of a person at delivery point.</li>
            <li>For B2B, retailers must arrange unloading, manpower, forklift, or storage facilities.</li>
            <li>For B2C, consumers must inspect packaging before accepting delivery.</li>
          </ul>
          <p><em>Nexiomart is not liable for redelivery charges, demurrage, or failed deliveries caused by incorrect details or unavailability of consignee.</em></p>

          <h2>11. Documentation & Compliance</h2>
          <ul>
            <li>All shipments will carry statutory documents (Tax Invoice, E-Way Bill, LR/Challan).</li>
            <li>Manufacturers/retailers are responsible for document accuracy.</li>
            <li>Nexiomart only facilitates digital record-keeping and is not liable for penalties arising from missing/incorrect documentation provided by the seller.</li>
          </ul>

          <h2>12. Force Majeure</h2>
          <p>Nexiomart, manufacturers, and logistics partners shall not be liable for delays or failures caused by events beyond reasonable control including natural calamities, lockdowns, strikes, transport shutdowns, or government restrictions.</p>

          <h2>13. Limitation of Nexiomart’s Liability</h2>
          <ul>
            <li>Nexiomart is a platform facilitator and not a carrier.</li>
            <li>Nexiomart’s liability in shipping is strictly limited to: (i) Providing tracking information in Model A, (ii) Facilitating claims with logistics partner in Model A, (iii) Ensuring manufacturer/retailer has confirmed dispatch in Model B & C.</li>
            <li>Under no circumstances shall Nexiomart be liable for indirect, consequential, or incidental damages including lost profits, loss of goodwill, or business interruptions.</li>
            <li>Nexiomart’s maximum liability, if held accountable by law, shall not exceed the invoice value of goods shipped through Nexiomart logistics.</li>
          </ul>

          <h2>14. Policy Modification & Supersession</h2>
          <p>Nexiomart reserves the right to modify, update, or replace this Shipping & Delivery Policy at any time without prior notice. The latest published version on the Nexiomart platform/website will always supersede and replace all previous versions. Stakeholders are advised to review the policy periodically for updates.</p>

          <h2>15. Contact for Escalations</h2>
          <p>
            Email: <a href='mailto:Partnerships@nexiomart.com'>Partnerships@nexiomart.com</a><br />
            Phone/WhatsApp: +91-8319918953<br />
            {/* Support Hours: Mon–Sat, 10:00 AM – 7:00 PM IST */}
          </p>
        </div>
      </div>
    );
  }
}

export default ShippingPolicy;

