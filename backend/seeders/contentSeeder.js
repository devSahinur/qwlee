const mongoose = require("mongoose");
const Privacy = mongoose.model("Privacy");
const Terms = mongoose.model("Terms");
const TrustSafety = mongoose.model("TrustSafety");

const PRIVACY = `<h2>Privacy Policy</h2>
<p>Qwlee respects your privacy. This policy explains what data we collect, how we use it, and your rights.</p>

<h3>1. Information we collect</h3>
<ul>
  <li>Account data: name, email, payment information.</li>
  <li>Profile data: bio, portfolio, language, location.</li>
  <li>Usage data: pages viewed, gigs ordered, messages sent.</li>
</ul>

<h3>2. How we use your information</h3>
<p>To deliver the marketplace, process payments, prevent fraud, and improve the platform.</p>

<h3>3. Sharing</h3>
<p>We share data with payment processors (Stripe), email providers, and law enforcement when legally required.</p>

<h3>4. Your rights</h3>
<p>You can access, correct, or delete your data at any time from your account settings or by emailing privacy@qwlee.com.</p>

<h3>5. Retention</h3>
<p>We retain account data for as long as your account is active, and for up to 7 years after closure for tax and audit purposes.</p>

<p><em>Last updated: this is seed content. Replace with your finalized policy before launch.</em></p>`;

const TERMS = `<h2>Terms &amp; Conditions</h2>
<p>By using Qwlee you agree to these terms.</p>

<h3>1. Account eligibility</h3>
<p>You must be at least 18 and able to enter into a binding contract.</p>

<h3>2. Marketplace role</h3>
<p>Qwlee is a venue. Contracts for services are between buyer and seller. Qwlee is not a party to those contracts.</p>

<h3>3. Fees</h3>
<p>Sellers are subject to a 10% service fee on each completed order. Buyers may be charged a processing fee.</p>

<h3>4. Disputes</h3>
<p>Disputes should first be raised with the other party. Unresolved disputes can be escalated to Qwlee's trust &amp; safety team for mediation.</p>

<h3>5. Prohibited conduct</h3>
<ul>
  <li>Off-platform payments to circumvent fees.</li>
  <li>Misrepresentation of identity, skills, or work product.</li>
  <li>Harassment of other users.</li>
</ul>

<h3>6. Termination</h3>
<p>Qwlee may suspend or terminate accounts that violate these terms.</p>

<p><em>Last updated: this is seed content. Replace with your finalized terms before launch.</em></p>`;

const TRUST = `<h2>Trust &amp; Safety</h2>
<p>Qwlee's trust &amp; safety program protects buyers and sellers from fraud, harassment, and substandard work.</p>

<h3>How we protect buyers</h3>
<ul>
  <li>Payments held in escrow until delivery is accepted.</li>
  <li>Refund policy for non-delivery and material misrepresentation.</li>
  <li>Verified seller badges for identity-checked freelancers.</li>
</ul>

<h3>How we protect sellers</h3>
<ul>
  <li>Buyer verification before high-value orders.</li>
  <li>Chargeback protection on qualifying transactions.</li>
  <li>Mediation when buyers withhold payment after acceptance.</li>
</ul>

<h3>Reporting</h3>
<p>To report abusive behaviour, off-platform solicitation, or suspected fraud, use the "Report" button on any gig or message, or email <a href="mailto:trust@qwlee.com">trust@qwlee.com</a>.</p>

<p><em>Last updated: this is seed content. Replace with your finalized policies before launch.</em></p>`;

async function seedContent() {
  const privacy = await Privacy.create({ content: PRIVACY });
  const terms = await Terms.create({ content: TERMS });
  const trustSafety = await TrustSafety.create({ content: TRUST });
  return { privacy, terms, trustSafety };
}

module.exports = { seedContent };
