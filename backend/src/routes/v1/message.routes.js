const express = require("express");
const auth = require("../../middlewares/auth");
const messageController = require("../../controllers/message.controller");
const messageFileUploadMiddleware = require("../../middlewares/messageFileUpload");
const imgbbUpload = require("../../middlewares/imgbbUpload");

const upload = messageFileUploadMiddleware();
const router = express.Router();

router
  .route("/add-message")
  .post(
    auth("withOutAdmin"),
    upload.array("files"),
    imgbbUpload(),
    messageController.addMessage
  );
router
  .route("/get-messages")
  .get(auth("withOutAdmin"), messageController.getMessages);
router
  .route("/:messageId")
  .get(auth("withOutAdmin"), messageController.getMessage)
  .patch(auth("withOutAdmin"), messageController.updateMessageStatus)
  .put(auth("withOutAdmin"), messageController.cancelAndWithdrawOfferMessage)
  .delete(auth("withOutAdmin"), messageController.deleteMessage);

module.exports = router;
