// Lightweight per-user activity log.
//
// Two kinds of rows so the admin can answer both "who signed in from
// where" and "what is this user doing inside the product":
//   - type=login   → user signed in. `ip` + `userAgent` captured.
//   - type=page    → user landed on a route. `route` captured; when the
//     client emits a follow-up event the previous row's `durationMs` is
//     updated so we can roll up time-on-page.
//
// Indexed on { userId, createdAt } so the admin detail page can pull a
// user's recent timeline without a collection scan.

const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const activitySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["login", "page", "logout"],
      default: "page",
    },
    route: { type: String, default: "" },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, createdAt: -1 });

activitySchema.plugin(toJSON);
activitySchema.plugin(paginate);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
