const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { reviewsService } = require("../services");

const createReview = catchAsync(async (req, res) => {
  const review = await reviewsService.createReview(req.body, req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Review Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: review,
    })
  );
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "status", "userId", "gigId", "freelancerId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const reviews = await reviewsService.getReviews(filter, options, req.query.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "All Reviews",
      status: "OK",
      statusCode: httpStatus.OK,
      data: reviews,
    })
  );
});

const getReviewByOrder = catchAsync(async (req, res) => {
  const review = await reviewsService.getReviewByOrder(
    req.params.orderId,
    req.user.id
  );
  res.status(httpStatus.OK).json(
    response({
      message: review ? "Review found" : "No review yet",
      status: "OK",
      statusCode: httpStatus.OK,
      data: review,
    })
  );
});

const replyReview = catchAsync(async (req, res) => {
  const review = await reviewsService.replyToReview(
    req.params.reviewId,
    req.user.id,
    req.body?.message
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Reply posted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: review,
    })
  );
});

module.exports = {
  createReview,
  getReviews,
  getReviewByOrder,
  replyReview,
};
