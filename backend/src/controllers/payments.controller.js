// Public payment-checkout controller. Delegates to the paymentRouter
// which picks the right provider based on the request body. Mirrors
// the shape of the existing /orders/checkout endpoint so the buyer
// flow is a drop-in change (frontend picks the provider, server
// returns { url } either way).

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const paymentRouter = require("../services/paymentRouter.service");

const createCheckout = catchAsync(async (req, res) => {
  const session = await paymentRouter.createCheckout({
    providerId: req.body.provider,
    items: req.body.items || [],
    metadata: {
      currency: req.body.currency || "USD",
      orderId: req.body.orderId,
      gigId: req.body.gigId,
      freelancerId: req.body.freelancerId,
      clientId: req.user?.id,
      messageId: req.body.messageId || "",
      price: req.body.price,
      deliveryDate: req.body.deliveryDate,
    },
    user: req.user || {},
  });

  res.status(httpStatus.OK).json(
    response({
      message: "Checkout session created",
      status: "OK",
      statusCode: httpStatus.OK,
      data: session,
    })
  );
});

module.exports = { createCheckout };
