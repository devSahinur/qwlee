// Support ticket — a conversation between a user and the admin team.
//
// Status flow: open → pending (admin waiting on user) → resolved → closed.
// Soft-delete via isDeleted so historical tickets stay around for audit.
//
// Messages live in their own collection (supportMessage.model.js) so a
// busy ticket doesn't bloat the parent document.

const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const ticketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, maxlength: 200 },
    category: {
      type: String,
      enum: ["billing", "orders", "account", "trust-safety", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    lastMessageAt: { type: Date, default: Date.now },
    unreadByUser: { type: Number, default: 0 },
    unreadByAdmin: { type: Number, default: 1 }, // initial message is unread
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ticketSchema.index({ status: 1, lastMessageAt: -1 });
ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

module.exports = mongoose.model("SupportTicket", ticketSchema);
