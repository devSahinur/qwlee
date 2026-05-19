const { Notification } = require("../src/models");
const { pick, daysAgo } = require("./utils/random");

// Mix of order/payment/message notifications, mostly recent, mostly unread.
async function seedNotifications({ orders, reviews, sellers, buyers }) {
  const docs = [];

  // Order notifications for the seller.
  for (const order of orders.slice(0, 10)) {
    docs.push({
      receiverId: order.freelancerId,
      role: "freelancer",
      type: "order",
      message: `New order received for "${order.data?.title || "your gig"}" (${order.data?.packageName || "package"})`,
      linkId: order._id.toString(),
      viewStatus: false,
      createdAt: order.createdAt,
      updatedAt: order.createdAt,
    });
  }

  // Payment confirmations for the buyer.
  for (const order of orders.slice(0, 8)) {
    docs.push({
      receiverId: order.clientId,
      role: "buyer",
      type: "payment",
      message: `Payment of $${order.price} confirmed for "${order.data?.title || "your order"}"`,
      linkId: order._id.toString(),
      viewStatus: true,
      createdAt: order.createdAt,
      updatedAt: order.createdAt,
    });
  }

  // Review notifications for the seller.
  for (const review of reviews.slice(0, 6)) {
    docs.push({
      receiverId: review.freelancerId,
      role: "freelancer",
      type: "message",
      message: `You received a ${review.rating}-star review`,
      linkId: review._id.toString(),
      viewStatus: false,
      createdAt: review.createdAt,
      updatedAt: review.createdAt,
    });
  }

  const notifications = await Notification.insertMany(docs);
  return { notifications };
}

module.exports = { seedNotifications };
