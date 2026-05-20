// Admin gig moderation. Lives separately from the seller-facing gig
// controller so the auth boundary is obvious — every action here is
// admin-only.

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const { Gig, User } = require("../models");

const STATUSES = [
  "active",
  "pending",
  "requires-modification",
  "draft",
  "denied",
  "paused",
];

const updateGigStatus = catchAsync(async (req, res) => {
  const { status, reason = "" } = req.body || {};
  if (!STATUSES.includes(status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `status must be one of: ${STATUSES.join(", ")}`
    );
  }

  const gig = await Gig.findById(req.params.gigId).populate(
    "userId",
    "fullName email username"
  );
  if (!gig) throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");

  gig.gigStatus = status;
  gig.moderation = {
    reason: String(reason || "").slice(0, 500),
    reviewedBy: req.user.id,
    reviewedAt: new Date(),
  };
  await gig.save();

  // Email the seller about the status change. Best-effort — never blocks.
  try {
    const emailService = require("../services/email.service");
    const seller = gig.userId;
    if (seller?.email) {
      const subjectByStatus = {
        active: `Your gig is live — ${gig.title}`,
        denied: `Gig submission denied — ${gig.title}`,
        "requires-modification": `Your gig needs changes — ${gig.title}`,
        paused: `Your gig has been paused — ${gig.title}`,
        pending: `Your gig is pending review — ${gig.title}`,
        draft: `Your gig is back to draft — ${gig.title}`,
      };
      emailService.sendEmail(
        seller.email,
        subjectByStatus[status] || `Gig status updated — ${gig.title}`,
        `<p>Hi ${seller.fullName || seller.username || "there"},</p>
         <p>Your gig <strong>${escapeHtml(gig.title)}</strong> has been moved to status <strong>${status}</strong>.</p>
         ${reason ? `<p><strong>Reviewer notes:</strong></p><blockquote style="margin:8px 0;padding:10px 14px;border-left:3px solid #cbd5e1;background:#f8fafc;color:#475569;">${escapeHtml(reason)}</blockquote>` : ""}
         <p>Manage your gigs at <a href="${process.env.FRONTEND_URL || "http://localhost:8000"}/dashboard">your dashboard</a>.</p>`
      );
    }
  } catch (e) {
    /* swallow */
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Gig status updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { gig },
    })
  );
});

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Admin delete = soft-delete by default (isDeleted: true). Hard-delete
// would orphan orders/reviews/loves that still reference the gig. The
// admin can pass `?hard=true` to permanently remove a gig when it has
// no order history (e.g. a spam listing the admin caught at the
// pending-approval stage).
const deleteGig = catchAsync(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");

  const wantsHard = String(req.query.hard || "").toLowerCase() === "true";
  if (wantsHard) {
    const { Payment, Reviews } = require("../models");
    const [orderCount, reviewCount] = await Promise.all([
      Payment.countDocuments({ gigId: gig._id }),
      Reviews.countDocuments({ gigId: gig._id }),
    ]);
    if (orderCount > 0 || reviewCount > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot hard-delete: gig has ${orderCount} order${orderCount === 1 ? "" : "s"} and ${reviewCount} review${reviewCount === 1 ? "" : "s"}. Use a soft delete instead.`
      );
    }
    await Gig.deleteOne({ _id: gig._id });
    return res.status(httpStatus.OK).json(
      response({
        message: "Gig permanently deleted",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { gigId: gig._id, hard: true },
      })
    );
  }

  gig.isDeleted = true;
  gig.gigStatus = "paused";
  gig.moderation = {
    reason:
      (req.body?.reason && String(req.body.reason).slice(0, 500)) ||
      "Gig removed by an administrator.",
    reviewedBy: req.user.id,
    reviewedAt: new Date(),
  };
  await gig.save();
  res.status(httpStatus.OK).json(
    response({
      message: "Gig removed",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { gig },
    })
  );
});

// Restore a previously soft-deleted gig. Sets isDeleted=false and
// status=pending so the admin reviews it again before it goes live.
const restoreGig = catchAsync(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) throw new ApiError(httpStatus.NOT_FOUND, "Gig not found");
  gig.isDeleted = false;
  gig.gigStatus = "pending";
  gig.moderation = {
    reason: "Restored by admin — pending re-approval.",
    reviewedBy: req.user.id,
    reviewedAt: new Date(),
  };
  await gig.save();
  res.status(httpStatus.OK).json(
    response({
      message: "Gig restored",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { gig },
    })
  );
});

module.exports = { updateGigStatus, deleteGig, restoreGig, STATUSES };
