const httpStatus = require("http-status");
const BannerImage = require("../models/banner.model");
const ApiError = require("../utils/ApiError");

const addBannerImage = async (payload) => {
  try {
    const bannerImage = await BannerImage.create(payload);
    return bannerImage;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error?.message || "Something went wrong"
    );
  }
};

const getBannerImages = async (filter, options) => {
  try {
    const bannerImages = await BannerImage.paginate(filter, options);
    return bannerImages;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong"
    );
  }
};

const deleteBannerImage = async (bannerImageId) => {
  try {
    const bannerImage = await BannerImage.findByIdAndDelete(bannerImageId);
    if (!bannerImage) {
      throw new ApiError(httpStatus.NOT_FOUND, "Image not found");
    }
    return bannerImage;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong"
    );
  }
};

module.exports = {
  addBannerImage,
  getBannerImages,
  deleteBannerImage
};
