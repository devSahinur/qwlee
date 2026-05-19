const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const searchService = require("../services/search.service");

// Public — `req.user` may be undefined (optionalAuth in front of the
// route). Anonymous searches are first-class citizens here.
const track = catchAsync(async (req, res) => {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    "";
  await searchService.track({
    query: req.body?.query,
    displayQuery: req.body?.displayQuery || req.body?.query,
    userId: req.user?.id || null,
    ip,
    country: req.body?.country,
    countryCode: req.body?.countryCode,
    city: req.body?.city,
    userAgent: req.headers["user-agent"] || "",
    referer: req.headers["referer"] || req.body?.referer || "",
    route: req.body?.route || "",
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Search tracked",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {},
    })
  );
});

const trending = catchAsync(async (req, res) => {
  const data = await searchService.getTrending({
    days: Number(req.query.days) || 7,
    limit: Number(req.query.limit) || 10,
  });
  res.status(httpStatus.OK).json(
    response({
      message: "Trending searches",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { results: data },
    })
  );
});

const list = catchAsync(async (req, res) => {
  const data = await searchService.listForAdmin({
    search: req.query.search || "",
    country: req.query.country || "",
    scope: req.query.scope || "all",
    limit: Number(req.query.limit) || 50,
    page: Number(req.query.page) || 1,
  });
  res.status(httpStatus.OK).json(
    response({
      message: "Search logs",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const adminStats = catchAsync(async (req, res) => {
  const data = await searchService.stats();
  res.status(httpStatus.OK).json(
    response({
      message: "Search stats",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

module.exports = { track, trending, list, adminStats };
