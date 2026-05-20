const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const gigSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    categoriesId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Categories",
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: Array,
    },
    // Lifecycle status — Fiverr-style. Existing gigs default to
    // "active" so the new field is back-compat. Newly created gigs
    // could later default to "pending" once admin moderation is on.
    gigStatus: {
      type: String,
      enum: [
        "active",
        "pending",
        "requires-modification",
        "draft",
        "denied",
        "paused",
      ],
      default: "active",
      index: true,
    },
    // Per-gig running counters, updated incrementally. Cancellations
    // aren't stored here — they're derived live from the Payment
    // collection so the count stays correct even if an order is
    // refunded / un-cancelled.
    stats: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
    },
    // Admin moderation note shown to the seller when status is
    // "requires-modification" or "denied".
    moderation: {
      reason: { type: String, default: "" },
      reviewedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        default: null,
      },
      reviewedAt: { type: Date, default: null },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gigSchema.plugin(paginate);

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
