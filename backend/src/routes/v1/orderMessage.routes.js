const { Router } = require("express");
const auth = require("../../middlewares/auth");
const orderMessageController = require("../../controllers/orderMessage.controller");
const messageFileUploadMiddleware = require("../../middlewares/messageFileUpload");
const imgbbUpload = require("../../middlewares/imgbbUpload");

const upload = messageFileUploadMiddleware();
const router = Router();

router
  .route("/")
  .post(
    auth("withOutAdmin"),
    upload.array("files"),
    imgbbUpload(),
    orderMessageController.addOrderMessage
  )
  .get(auth("withOutAdmin"), orderMessageController.getOrderMessages);

module.exports = router;
