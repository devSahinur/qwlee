const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");
const Orders = require("../models/orders.model");
const { addCustomNotification } = require("./notification.service");

const STATUS_KEYS = ["active", "late", "delivered", "cancelled"];

// Count orders per status for the manage-orders tab badges. `role` is
// either "buyer" or "seller" (matches the user's view mode), so a single
// account can pull either side's counts.
const getOrderCounts = async (userId, role = "buyer") => {
  const matchKey = role === "seller" ? "freelancerId" : "clientId";
  const match = {
    [matchKey]: new mongoose.Types.ObjectId(userId),
    isDeleted: { $ne: true },
  };
  const grouped = await Payment.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(STATUS_KEYS.map((k) => [k, 0]));
  let total = 0;
  for (const row of grouped) {
    if (counts.hasOwnProperty(row._id)) counts[row._id] = row.count;
    total += row.count;
  }
  return { ...counts, all: total };
};

const orderCreate = async (body, clientId) => {
  const newBody = {
    ...body,
    clientId,
  };
  const order = Orders.create(newBody);
  return order;
};

const getOrders = async (filter, options, userId) => {
  filter.clientId = userId;
  options.populate = [
    {
      path: "gigId",
    },
    {
      path: "freelancerId",
    },
    {
      path: "clientId",
    },
  ];

  // Retrieve the paginated orders
  const orders = await Orders.paginate(filter, options);

  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Payment.findById(orderId).populate(
    "gigId freelancerId clientId"
  );
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};
const freelancerOrdersList = async (filter, options, userId) => {
  filter.freelancerId = userId;
  options.populate = [
    {
      path: "gigId",
    },
    {
      path: "freelancerId",
    },
    {
      path: "clientId",
    },
  ];

  // Retrieve the paginated orders
  const orders = await Payment.paginate(filter, options);

  return orders;
};

const createOrderRequest = async (body) => {
  const order = Orders.create(body);
  return order;
};

const getMyOrders = async (filter, options, userId) => {
  options.populate = [
    {
      path: "gigId",
    },
    {
      path: "freelancerId",
    },
    {
      path: "clientId",
    },
  ];

  filter.clientId = userId;
  // Retrieve the paginated orders
  const orders = await Payment.paginate(filter, options);

  return orders;
};

const orderModify = async (paymentId, body, userId) => {
  const order = await Payment.findById(paymentId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  Object.assign(order, body);
  await order.save();

  if (order.status === "delivered") {
    // Calculate the amount after deducting the 5% commission
    const orderAmount = order?.items[0]?.price;
    const commission = orderAmount * 0.05;
    const amountAfterCommission = orderAmount - commission;

    // Update freelancer's balance with the amount after deducting commission
    const updatedFreelancer = await User.findByIdAndUpdate(
      order.freelancerId,
      { $inc: { balance: amountAfterCommission } },
      { new: true }
    );

    if (!updatedFreelancer) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update freelancer balance"
      );
    }

    const notificationData = {
      receiverId: order?.freelancerId,
      message: `Your order has been delivered`,
      role: "freelancer",
      type: "order",
      viewStatus: false,
    };

    // Send the notification using addCustomNotification
    await addCustomNotification(
      "order-delivered",
      order?.freelancerId,
      notificationData
    );
  }

  return order;
};

module.exports = {
  orderCreate,
  getOrders,
  createOrderRequest,
  getMyOrders,
  getOrderById,
  orderModify,
  freelancerOrdersList,
  getOrderCounts,
};
