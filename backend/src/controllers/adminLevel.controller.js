// Admin-side seller-level controls.

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const sellerLevelService = require("../services/sellerLevel.service");

const listSellerLevels = catchAsync(async (req, res) => {
  const sellers = await sellerLevelService.listAllSellerLevels({
    search: req.query.search || "",
  });
  res.status(httpStatus.OK).json(
    response({
      message: "Seller levels",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { sellers },
    })
  );
});

const getTiers = catchAsync(async (req, res) => {
  const tiers = await sellerLevelService.getCurrentTiers();
  res.status(httpStatus.OK).json(
    response({
      message: "Level tiers",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { tiers },
    })
  );
});

const updateTiers = catchAsync(async (req, res) => {
  try {
    const tiers = await sellerLevelService.updateTiers(req.body?.tiers);
    res.status(httpStatus.OK).json(
      response({
        message: "Tiers updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { tiers },
      })
    );
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
});

const setOverride = catchAsync(async (req, res) => {
  try {
    const user = await sellerLevelService.setLevelOverride(req.params.userId, {
      tierId: req.body?.tierId || "",
      reason: req.body?.reason || "",
      adminId: req.user.id,
    });
    res.status(httpStatus.OK).json(
      response({
        message: req.body?.tierId
          ? "Level override set"
          : "Level override cleared",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { user },
      })
    );
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
});

module.exports = { listSellerLevels, getTiers, updateTiers, setOverride };
