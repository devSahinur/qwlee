// Activity tracking — bookkeeping the per-user trail of logins and
// page visits. Used by the admin "monitor a single user" feature.
//
// track() does double duty: appends a new "page" event, and if the
// previous "page" event for this user has no duration yet, backfills
// the dwell time. The client only has to fire one event per route
// change.

const mongoose = require("mongoose");
const { Activity, User } = require("../models");

async function recordLogin({ userId, ip, userAgent }) {
  if (!userId) return null;
  return Activity.create({
    userId,
    type: "login",
    ip: ip || "",
    userAgent: userAgent || "",
  });
}

async function recordPage({ userId, route, ip, userAgent, durationMs }) {
  if (!userId || !route) return null;

  // Backfill the previous page's dwell time when the client doesn't
  // provide one. Cheap targeted query thanks to the (userId, createdAt)
  // index.
  if (durationMs == null) {
    const prev = await Activity.findOne({ userId, type: "page" })
      .sort({ createdAt: -1 })
      .limit(1);
    if (prev && (!prev.durationMs || prev.durationMs === 0)) {
      const diff = Math.max(0, Date.now() - new Date(prev.createdAt).getTime());
      // Cap at 30 minutes so an abandoned tab doesn't poison per-route
      // averages.
      prev.durationMs = Math.min(diff, 30 * 60 * 1000);
      await prev.save();
    }
  }

  return Activity.create({
    userId,
    type: "page",
    route,
    ip: ip || "",
    userAgent: userAgent || "",
    durationMs: durationMs || 0,
  });
}

// Read a user's activity for the admin dashboard. Returns timeline +
// per-route + per-IP rollups.
async function getUserActivity(userId, options = {}) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }
  const objectId = new mongoose.Types.ObjectId(userId);
  const limit = Math.min(Number(options.limit) || 50, 200);

  const [user, timeline, perRoute, logins] = await Promise.all([
    User.findById(objectId).select(
      "fullName username email role image online lastSeen location createdAt"
    ),
    Activity.find({ userId: objectId }).sort({ createdAt: -1 }).limit(limit),
    Activity.aggregate([
      { $match: { userId: objectId, type: "page", route: { $ne: "" } } },
      {
        $group: {
          _id: "$route",
          visits: { $sum: 1 },
          totalMs: { $sum: { $ifNull: ["$durationMs", 0] } },
          lastVisit: { $max: "$createdAt" },
        },
      },
      { $sort: { visits: -1 } },
      { $limit: 50 },
    ]),
    Activity.find({ userId: objectId, type: "login" })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return {
    user,
    timeline,
    perRoute: perRoute.map((r) => ({
      route: r._id,
      visits: r.visits,
      totalMs: r.totalMs,
      lastVisit: r.lastVisit,
    })),
    logins,
  };
}

module.exports = {
  recordLogin,
  recordPage,
  getUserActivity,
};
