// Lightweight gig view + click counters. Both routes are fire-and-
// forget from the frontend (errors don't crash the user's flow), so we
// keep the implementation minimal: atomic $inc on the Gig document so
// concurrent views never lose count, and a graceful no-op when the
// gigId is malformed (an attacker can't poison the response).

const httpStatus = require("http-status");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { Gig } = require("../models");

function isValidObjectId(s) {
  return mongoose.Types.ObjectId.isValid(String(s || ""));
}

const bumpImpression = catchAsync(async (req, res) => {
  if (isValidObjectId(req.params.gigId)) {
    await Gig.updateOne(
      { _id: req.params.gigId, isDeleted: { $ne: true } },
      { $inc: { "stats.impressions": 1 } }
    );
  }
  res.status(httpStatus.OK).json(
    response({
      message: "ok",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const bumpClick = catchAsync(async (req, res) => {
  if (isValidObjectId(req.params.gigId)) {
    await Gig.updateOne(
      { _id: req.params.gigId, isDeleted: { $ne: true } },
      { $inc: { "stats.clicks": 1 } }
    );
  }
  res.status(httpStatus.OK).json(
    response({
      message: "ok",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

module.exports = { bumpImpression, bumpClick };
