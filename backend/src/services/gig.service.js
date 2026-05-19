const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Gig } = require("../models");

const createGig = async (data) => {
  const oldGig = await Gig.findOne({ slug: data.slug });
  if (oldGig) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This title already exists, try another one"
    );
  }
  const gig = await Gig.create(data);
  return gig;
};

const queryGigs = async (filter, options, { excludeUserId } = {}) => {

  // price comparison
  if (filter.minPrice || filter.maxPrice) {
    filter.price = {};
    if (filter.minPrice && filter.maxPrice) {
      filter.price = { $gte: filter.minPrice, $lte: filter.maxPrice };
    } else if (filter.minPrice) {
      filter.price = { $gte: filter.minPrice };
    } else if (filter.maxPrice) {
      filter.price = { $lte: filter.maxPrice };
    }
    delete filter.minPrice;
    delete filter.maxPrice;
  }

  options.populate = [
    { path: "userId" },
    { path: "categoriesId" },
  ];

  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (key === "title" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" };
    } else if (key === "categories") {
      query["categoriesId"] = filter[key];
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  if (excludeUserId) {
    query.userId = { $ne: excludeUserId };
  }

  const gigs = await Gig.paginate(query, options);
  return gigs;
};



const publicGigs = async (userId) => {
  const filter = {
    userId,
  };
  const options = {
    populate: "userId categoriesId",
  };
  const gigs = await Gig.paginate(filter, options);
  return gigs;
};

const getGigById = async (gigId) => {
  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  }
  return gig;
};

const getGigBySlug = async (slug) => {
  console.log(slug)
  const gig = await Gig.findOne({ slug });
  if (!gig) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  }
  return gig;
}

const updateGigById = async (gigId, data, images) => {
  let gig = await getGigById(gigId);
  if (!gig) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  }

  // Update gig data if needed
  Object.assign(gig, data);

  // Append the new images to the existing images array
  if (images && images.length > 0) {
    gig.images = gig.images ? gig.images : [];
    gig.images.push(...images); // Add multiple images to the existing array
  }

  // Save the updated gig
  await gig.save();
  return gig;
};




const deleteGigById = async (gigId) => {
  let gig = await getGigById(gigId);
  if (!gig) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  }
  await Gig.findByIdAndDelete(gigId);
  return gig;
};


const gigSingleImageDelete = async (gigId, image) => {
  let gig = await getGigById(gigId);
  if (!gig) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  }
  gig.images = gig.images.filter((img) => img !== image);
  await gig.save();
  return gig;
};

module.exports = {
  createGig,
  queryGigs,
  getGigById,
  updateGigById,
  deleteGigById,
  publicGigs,
  getGigBySlug,
  gigSingleImageDelete
};
