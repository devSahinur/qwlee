// One-shot script: trigger every new transactional email to infosahinur@gmail.com.
// Used to confirm the templates render cleanly in Gmail. Safe to delete after.

require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/config");
const e = require("../src/services/email.service");

const TO = process.env.SMOKE_EMAIL || "infosahinur@gmail.com";

async function main() {
  await mongoose.connect(config.mongoose.url);
  console.log("Connected. Sending samples to", TO);

  await e.sendOrderConfirmedBuyer(TO, {
    buyerName: "Sahinur",
    sellerName: "Priya Anand",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    price: 75,
    deliveryDate: new Date(Date.now() + 7 * 86400000),
  });
  await e.sendOrderConfirmedSeller(TO, {
    sellerName: "Priya Anand",
    buyerName: "Sahinur Islam",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    price: 75,
    deliveryDate: new Date(Date.now() + 7 * 86400000),
  });
  await e.sendOrderDeliveredBuyer(TO, {
    buyerName: "Sahinur",
    sellerName: "Priya Anand",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    message:
      "Here is the final logo plus the source files in AI and SVG. Let me know if you'd like any refinements!",
  });
  await e.sendDeliveryAcceptedSeller(TO, {
    sellerName: "Priya Anand",
    buyerName: "Sahinur Islam",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    price: 75,
  });
  await e.sendOrderCancelled(TO, {
    recipientName: "Sahinur",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    reason: "Buyer requested cancellation due to scope change.",
  });
  await e.sendExtensionRequestedBuyer(TO, {
    buyerName: "Sahinur",
    sellerName: "Priya Anand",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    newDeliveryDate: new Date(Date.now() + 10 * 86400000),
    reason: "Adding two extra concepts as discussed; need a couple more days.",
  });
  await e.sendExtensionResponseSeller(TO, {
    sellerName: "Priya Anand",
    buyerName: "Sahinur Islam",
    gigTitle: "I will design a modern logo for your brand",
    orderId: "660ac28b1e5b41f0fa1234ab",
    accepted: true,
    newDeliveryDate: new Date(Date.now() + 10 * 86400000),
  });
  await e.sendReviewReceivedSeller(TO, {
    sellerName: "Priya Anand",
    buyerName: "Sahinur Islam",
    gigTitle: "I will design a modern logo for your brand",
    rating: 5,
    review:
      "Absolutely amazing work — Priya nailed the brief on the first round. Will hire again.",
  });
  await e.sendReviewReplyBuyer(TO, {
    buyerName: "Sahinur",
    sellerName: "Priya Anand",
    gigTitle: "I will design a modern logo for your brand",
    reply: "Thank you so much! It was a pleasure working with you. ❤️",
  });
  await e.sendCustomOfferReceivedBuyer(TO, {
    buyerName: "Sahinur",
    sellerName: "Priya Anand",
    title: "Logo + brand guide + social kit",
    price: 240,
    deliveryDays: 5,
  });
  await e.sendNewMessageEmail(TO, {
    recipientName: "Sahinur",
    senderName: "Priya Anand",
    preview: "Hey! Quick question on the brief — do you have a preferred colour palette?",
  });
  await e.sendWithdrawalRequested(TO, {
    recipientName: "Priya",
    amount: 320,
    bankName: "ANZ",
    accountNumber: "12345678",
  });
  await e.sendWithdrawalApproved(TO, {
    recipientName: "Priya",
    amount: 320,
    bankName: "ANZ",
  });
  await e.sendWithdrawalDeclined(TO, {
    recipientName: "Priya",
    amount: 320,
    reason: "Bank details could not be verified. Please re-enter and try again.",
  });
  await e.sendAccountBanned(TO, {
    recipientName: "Test User",
    reason: "Sample only — this is the suspension email template.",
  });
  await e.sendVerificationApproved(TO, { recipientName: "Priya" });
  await e.sendVerificationRejected(TO, {
    recipientName: "Priya",
    reason: "Selfie was too blurry to confirm the ID match.",
  });
  await e.sendEmailVerification(TO, "482190");
  await e.sendResetPasswordEmail(TO, "739281");

  console.log("All template samples enqueued.");
  await new Promise((r) => setTimeout(r, 2500));
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
