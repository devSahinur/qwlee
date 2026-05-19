const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const bannerService = require("../services/banner.service");
const response = require("../config/response");
const pick = require("../utils/pick");

const addBannerImage = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "At least one image is required"
    );
  }
  const bannerImagesBody = req.files.map((file) => ({
    image: file.cloudUrl,
  }));

  const result = await bannerService.addBannerImage(bannerImagesBody);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Banner Images added successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

const getBannerImages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "image"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await bannerService.getBannerImages(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Banner Images",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const deleteBannerImage = catchAsync(async (req, res) => {
  const { bannerId } = req.params;
  await bannerService.deleteBannerImage(bannerId);
  res.status(httpStatus.OK).json(
    response({
      message: "Banner Image Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
})

module.exports = {
  addBannerImage,
  getBannerImages,
  deleteBannerImage
};
