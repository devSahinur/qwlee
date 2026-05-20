// Admin-side platform settings + public payment-methods list.

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const appConfigService = require("../services/appConfig.service");

const getSettings = catchAsync(async (req, res) => {
  const config = await appConfigService.getConfig();
  res.status(httpStatus.OK).json(
    response({
      message: "Platform settings",
      status: "OK",
      statusCode: httpStatus.OK,
      data: config,
    })
  );
});

const updateSettings = catchAsync(async (req, res) => {
  const config = await appConfigService.updateConfig(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Settings updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: config,
    })
  );
});

const addCustomPayment = catchAsync(async (req, res) => {
  try {
    const config = await appConfigService.addCustomPayment(req.body);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Custom payment added",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: config,
      })
    );
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
});

const removeCustomPayment = catchAsync(async (req, res) => {
  const config = await appConfigService.removeCustomPayment(req.params.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Custom payment removed",
      status: "OK",
      statusCode: httpStatus.OK,
      data: config,
    })
  );
});

// Public — no secrets. Used by the checkout page to render the
// payment-method picker.
const getPublicMethods = catchAsync(async (req, res) => {
  const methods = await appConfigService.getPublicMethods();
  res.status(httpStatus.OK).json(
    response({
      message: "Available payment methods",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { methods },
    })
  );
});

// Admin "send me a sample" — fires one of the transactional templates
// to an arbitrary email so the admin can preview rendering in Gmail
// (or wherever the configured SMTP delivers). Uses mock data with the
// recipient's email — never deducts from real records.
const sendTemplateSample = catchAsync(async (req, res) => {
  const e = require("../services/email.service");
  const to = (req.body?.to || req.user?.email || "").trim();
  const template = req.body?.template || "verification";
  if (!to) throw new ApiError(httpStatus.BAD_REQUEST, "Missing recipient");

  const handlers = {
    verification: () => e.sendEmailVerification(to, "482190"),
    resetPassword: () => e.sendResetPasswordEmail(to, "739281"),
    orderConfirmedBuyer: () =>
      e.sendOrderConfirmedBuyer(to, {
        buyerName: "Sahinur",
        sellerName: "Priya Anand",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        price: 75,
        deliveryDate: new Date(Date.now() + 7 * 86400000),
      }),
    orderConfirmedSeller: () =>
      e.sendOrderConfirmedSeller(to, {
        sellerName: "Priya Anand",
        buyerName: "Sahinur Islam",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        price: 75,
        deliveryDate: new Date(Date.now() + 7 * 86400000),
      }),
    delivered: () =>
      e.sendOrderDeliveredBuyer(to, {
        buyerName: "Sahinur",
        sellerName: "Priya Anand",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        message:
          "Final logo + AI/SVG source files attached in the order chat. Ping if any tweaks needed!",
      }),
    accepted: () =>
      e.sendDeliveryAcceptedSeller(to, {
        sellerName: "Priya Anand",
        buyerName: "Sahinur Islam",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        price: 75,
      }),
    cancelled: () =>
      e.sendOrderCancelled(to, {
        recipientName: "Sahinur",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        reason: "Buyer requested cancellation due to scope change.",
      }),
    extensionRequest: () =>
      e.sendExtensionRequestedBuyer(to, {
        buyerName: "Sahinur",
        sellerName: "Priya Anand",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        newDeliveryDate: new Date(Date.now() + 10 * 86400000),
        reason: "Adding two extra concepts — need a couple more days.",
      }),
    extensionAccepted: () =>
      e.sendExtensionResponseSeller(to, {
        sellerName: "Priya Anand",
        buyerName: "Sahinur Islam",
        gigTitle: "I will design a modern logo for your brand",
        orderId: "660ac28b1e5b41f0fa1234ab",
        accepted: true,
        newDeliveryDate: new Date(Date.now() + 10 * 86400000),
      }),
    reviewReceived: () =>
      e.sendReviewReceivedSeller(to, {
        sellerName: "Priya Anand",
        buyerName: "Sahinur Islam",
        gigTitle: "I will design a modern logo for your brand",
        rating: 5,
        review:
          "Absolutely amazing work — Priya nailed the brief on the first round. Will hire again.",
      }),
    reviewReply: () =>
      e.sendReviewReplyBuyer(to, {
        buyerName: "Sahinur",
        sellerName: "Priya Anand",
        gigTitle: "I will design a modern logo for your brand",
        reply: "Thank you so much! It was a pleasure working with you.",
      }),
    customOffer: () =>
      e.sendCustomOfferReceivedBuyer(to, {
        buyerName: "Sahinur",
        sellerName: "Priya Anand",
        title: "Logo + brand guide + social kit",
        price: 240,
        deliveryDays: 5,
      }),
    newMessage: () =>
      e.sendNewMessageEmail(to, {
        recipientName: "Sahinur",
        senderName: "Priya Anand",
        preview:
          "Hey! Quick question on the brief — do you have a preferred colour palette?",
      }),
    withdrawalRequested: () =>
      e.sendWithdrawalRequested(to, {
        recipientName: "Priya",
        amount: 320,
        bankName: "ANZ",
        accountNumber: "12345678",
      }),
    withdrawalApproved: () =>
      e.sendWithdrawalApproved(to, {
        recipientName: "Priya",
        amount: 320,
        bankName: "ANZ",
      }),
    withdrawalDeclined: () =>
      e.sendWithdrawalDeclined(to, {
        recipientName: "Priya",
        amount: 320,
        reason:
          "Bank details could not be verified. Please re-enter and try again.",
      }),
    accountBanned: () =>
      e.sendAccountBanned(to, {
        recipientName: "Test User",
        reason: "Sample only — this is the suspension email template.",
      }),
    verificationApproved: () =>
      e.sendVerificationApproved(to, { recipientName: "Priya" }),
    verificationRejected: () =>
      e.sendVerificationRejected(to, {
        recipientName: "Priya",
        reason: "Selfie was too blurry to confirm the ID match.",
      }),
    all: async () => {
      const keys = Object.keys(handlers).filter((k) => k !== "all");
      for (const k of keys) {
        // small stagger so Gmail doesn't rate-limit the burst
        await handlers[k]();
        await new Promise((r) => setTimeout(r, 250));
      }
    },
  };

  const fn = handlers[template];
  if (!fn) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Unknown template '${template}'. Known: ${Object.keys(handlers).join(", ")}`
    );
  }
  await fn();
  res.status(httpStatus.OK).json(
    response({
      message: `Sample '${template}' sent to ${to}`,
      status: "OK",
      statusCode: httpStatus.OK,
      data: { to, template },
    })
  );
});

module.exports = {
  getSettings,
  updateSettings,
  addCustomPayment,
  removeCustomPayment,
  getPublicMethods,
  sendTemplateSample,
};
