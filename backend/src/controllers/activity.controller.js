// Controllers for the user-activity tracking feature.

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const activityService = require("../services/activity.service");

// Public-ish endpoint — gated by "common" auth so any signed-in user
// can report their own activity. The userId is taken from the token,
// never from the body, so a client can't ghost-write other users.
const track = catchAsync(async (req, res) => {
  const { route, durationMs, type } = req.body || {};
  const userId = req.user.id;
  const ip = req.ip || req.headers["x-forwarded-for"] || "";
  const userAgent = req.headers["user-agent"] || "";

  if (type === "logout") {
    // Treat as an empty activity row; useful to bookend a session.
    await activityService.recordPage({ userId, route: route || "/__logout__", ip, userAgent, durationMs });
  } else {
    await activityService.recordPage({ userId, route, ip, userAgent, durationMs });
  }

  res.status(httpStatus.CREATED).json(
    response({
      message: "Activity recorded",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {},
    })
  );
});

// Admin-only — pulls timeline + rollups for a single user.
const getUserActivity = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const result = await activityService.getUserActivity(userId, { limit });
  if (!result.user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "User activity",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = { track, getUserActivity };
