const { default: mongoose } = require("mongoose");
const paginate = require("./plugins/paginate.plugin");
const orderMessageSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    content: {
      messageType: {
        type: String,
        enum: [
          "image",
          "application",
          "audio",
          "video",
          "unknown",
          "text",
          "deliveryMessage",
          "extensionRequest",
          "extensionResponse",
        ],
        required: false,
      },
      message: { type: String, required: false },
      files: [
        {
          path: { type: String, required: false },
          fileType: { type: String, required: false },
        },
      ],
      deliveryDetails: {
        type: Object,
        required: false,
        default: {},
      },
      // Free-form payload for extensionRequest / extensionResponse
      // system messages. Carries the new delivery date, reason, and
      // current status so the chat bubble can render Accept/Decline
      // without a second round-trip.
      extensionDetails: {
        type: Object,
        required: false,
        default: {},
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

orderMessageSchema.plugin(paginate);

const OrderMessage = mongoose.model("OrderMessage", orderMessageSchema);
module.exports = OrderMessage;
