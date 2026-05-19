// Seller-verification service.
//
// Lifecycle:
//   unsubmitted → submitDocs() → pending → admin reviews →
//     approve()  (sets isVerified=true) or reject() (records reason).
// A rejected user can resubmit; submitDocs() clears the previous
// rejection reason.

const { User } = require("../models");

async function submitDocs(userId, { documentType, documentNumber, files }) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.verification?.status === "pending") {
    throw new Error("You already have a pending verification request.");
  }
  if (!documentType || !["nid", "passport"].includes(documentType)) {
    throw new Error("Document type must be 'nid' or 'passport'.");
  }
  const front = files?.front?.cloudUrl || files?.front;
  const back = files?.back?.cloudUrl || files?.back;
  const selfie = files?.selfie?.cloudUrl || files?.selfie;
  if (!front || !selfie) {
    throw new Error("A front photo of the document and a selfie are required.");
  }

  user.verification = {
    status: "pending",
    documentType,
    documentNumber: documentNumber || "",
    frontUrl: front,
    backUrl: back || "",
    selfieUrl: selfie,
    submittedAt: new Date(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  };
  // Approval flips `isVerified`, not submission — keep the flag honest.
  user.isVerified = false;
  await user.save();
  return user;
}

async function listPending({ status = "pending", limit = 50, page = 1 } = {}) {
  const filter = { "verification.status": status, isDeleted: false };
  const items = await User.find(filter)
    .sort({ "verification.submittedAt": -1 })
    .skip(Math.max(0, (page - 1) * limit))
    .limit(limit)
    .select(
      "fullName username email image role isVerified verification createdAt"
    );
  const total = await User.countDocuments(filter);
  return { results: items, totalResults: total, page, limit };
}

async function review(userId, { action, reason, reviewerId }) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.verification?.status !== "pending") {
    throw new Error("This account doesn't have a pending verification.");
  }
  if (action === "approve") {
    user.isVerified = true;
    user.verification.status = "approved";
    user.verification.rejectionReason = "";
  } else if (action === "reject") {
    user.isVerified = false;
    user.verification.status = "rejected";
    user.verification.rejectionReason = (reason || "").slice(0, 500);
  } else {
    throw new Error("action must be 'approve' or 'reject'.");
  }
  user.verification.reviewedAt = new Date();
  user.verification.reviewedBy = reviewerId;
  await user.save();
  return user;
}

module.exports = { submitDocs, listPending, review };
