const mongoose = require("mongoose");
const OrderMessage = mongoose.model("OrderMessage");
const { pick, rand } = require("./utils/random");

// One short conversation thread per order so the "order chat" page has
// content the moment you click into an order in the admin or frontend.
const TEMPLATES = [
  [
    { from: "buyer", text: "Hi! I've just placed the order — sending source assets in the next message." },
    { from: "seller", text: "Great, got it. I'll start tonight and ship a first pass by end of week." },
    { from: "buyer", text: "Perfect. Reach out if anything is unclear in the brief." },
  ],
  [
    { from: "seller", text: "Quick question on color palette — do you want me to match the existing logo or treat this as a refresh?" },
    { from: "buyer", text: "Treat as a refresh. We're not married to the current palette." },
    { from: "seller", text: "Got it. I'll bring 2 directions to the first review." },
  ],
  [
    { from: "seller", text: "First milestone delivered. Let me know what you think." },
    { from: "buyer", text: "Reviewed. Loving direction 2 — let's go deeper on it." },
  ],
];

// Messages must key on Payment._id (the id that travels in the order
// detail URL — the API resolves /orders/:id via Payment.findById). Iterate
// payments, not orders.
async function seedOrderMessages({ payments }) {
  if (!Array.isArray(payments) || payments.length === 0) return { orderMessages: [] };
  const docs = [];
  for (const payment of payments) {
    const thread = pick(TEMPLATES);
    const baseTime = payment.createdAt || new Date();
    for (let i = 0; i < thread.length; i++) {
      const entry = thread[i];
      const sender = entry.from === "buyer" ? payment.clientId : payment.freelancerId;
      const receiver = entry.from === "buyer" ? payment.freelancerId : payment.clientId;
      docs.push({
        orderId: payment._id,
        content: {
          messageType: "text",
          message: entry.text,
          files: [],
        },
        sender,
        receiver,
        createdAt: new Date(baseTime.getTime() + i * 60 * 60 * 1000),
        updatedAt: new Date(baseTime.getTime() + i * 60 * 60 * 1000),
      });
    }
  }
  const orderMessages = await OrderMessage.insertMany(docs);
  return { orderMessages };
}

module.exports = { seedOrderMessages };
