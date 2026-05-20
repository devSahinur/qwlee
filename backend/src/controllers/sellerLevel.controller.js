// Seller-facing dashboard endpoints — level overview + my-gigs stats.

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const sellerLevelService = require("../services/sellerLevel.service");

const myLevelOverview = catchAsync(async (req, res) => {
  const data = await sellerLevelService.computeLevelOverview(req.user.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Level overview",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const myGigsStats = catchAsync(async (req, res) => {
  const data = await sellerLevelService.listMyGigsWithStats(req.user.id);
  res.status(httpStatus.OK).json(
    response({
      message: "My gigs",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

module.exports = { myLevelOverview, myGigsStats };
