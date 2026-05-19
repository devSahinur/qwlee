// Search log — every marketplace search query gets a row here.
//
// `userId` is optional: anonymous visitors get tracked too (we never
// gate the marketplace search behind auth). `ip` + `country` + `city`
// come from the frontend's ipapi.co lookup (forwarded in the request
// body) with `req.ip` as a server-side fallback. We index `query` +
// `createdAt` so the trending aggregation stays cheap.

const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const searchLogSchema = mongoose.Schema(
  {
    // Normalised, lowercased query string used for the trending
    // aggregation. The raw form lives on `displayQuery` for the admin
    // table — preserves casing for reading but doesn't fragment counts.
    query: { type: String, required: true, trim: true, lowercase: true },
    displayQuery: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    ip: { type: String, default: "" },
    country: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    city: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    referer: { type: String, default: "" },
    route: { type: String, default: "" },
  },
  { timestamps: true }
);

searchLogSchema.index({ query: 1, createdAt: -1 });
searchLogSchema.index({ createdAt: -1 });

searchLogSchema.plugin(toJSON);
searchLogSchema.plugin(paginate);

module.exports = mongoose.model("SearchLog", searchLogSchema);
