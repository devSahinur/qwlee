const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Reviews, Orders } = require("../models");

// Create a review tied to a delivered order. Enforces:
//   - the order exists and belongs to the buyer
//   - the order is in a state that allows reviewing (delivered / completed)
//   - one review per order (per buyer)
//
// freelancerId + gigId are taken from the order so the buyer can't
// misattribute their review to a different seller/gig by tampering
// with the request body.
const createReview = async (payload, userId) => {
  const { orderId, rating, review } = payload || {};
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "orderId is required");
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "rating must be between 1 and 5");
  }
  if (!review || !String(review).trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "review text is required");
  }

  const order = await Orders.findById(orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  if (String(order.clientId) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only the buyer can review this order");
  }
  if (!["delivered", "completed"].includes(order.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only review an order once it's delivered"
    );
  }

  const existing = await Reviews.findOne({ orderId, userId });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already reviewed this order");
  }

  const newReview = await Reviews.create({
    userId,
    freelancerId: order.freelancerId,
    gigId: order.gigId,
    orderId,
    rating: Number(rating),
    review: String(review).trim(),
  });

  return newReview;
};

const getReviews = async (filter, options, userId) => {
  if (userId) {
    filter.userId = userId;
  }

  options.populate = [
    { path: "gigId" },
    { path: "userId" },
    { path: "freelancerId" },
  ];
  const reviews = await Reviews.paginate(filter, options);
  return reviews;
};

// Buyer-side lookup: was this order already reviewed? Returns the
// review doc or null so the order detail page can render the right
// CTA (Leave / Edit / show their existing review).
const getReviewByOrder = async (orderId, userId) => {
  if (!orderId) return null;
  return Reviews.findOne({ orderId, userId }).populate([
    { path: "userId" },
    { path: "freelancerId" },
    { path: "gigId" },
  ]);
};

// Seller's one-shot reply to a review. Only the freelancer the review
// is for can reply, and only once — subsequent calls are blocked so
// sellers can't rewrite history mid-dispute.
const replyToReview = async (reviewId, freelancerId, message) => {
  const text = String(message || "").trim();
  if (!text) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reply message is required");
  }
  if (text.length > 1500) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reply is too long (max 1500 chars)");
  }

  const review = await Reviews.findById(reviewId);
  if (!review) throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  if (String(review.freelancerId) !== String(freelancerId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only the seller of this gig can reply"
    );
  }
  if (review.sellerReply && review.sellerReply.message) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already replied to this review"
    );
  }

  review.sellerReply = { message: text, repliedAt: new Date() };
  await review.save();
  return review;
};

module.exports = {
  createReview,
  getReviews,
  getReviewByOrder,
  replyToReview,
};
