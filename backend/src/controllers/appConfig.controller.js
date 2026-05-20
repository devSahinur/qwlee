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

module.exports = {
  getSettings,
  updateSettings,
  addCustomPayment,
  removeCustomPayment,
  getPublicMethods,
};
