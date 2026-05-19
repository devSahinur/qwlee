// One message inside a support ticket thread.

const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const supportMessageSchema = mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    body: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
);

supportMessageSchema.index({ ticketId: 1, createdAt: 1 });
supportMessageSchema.plugin(toJSON);
supportMessageSchema.plugin(paginate);

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
