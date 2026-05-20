// Public-facing payments routes — the checkout page reads
// `/payments/methods` to render the picker, and POSTs to
// `/payments/checkout` to start a session on the chosen provider.

const express = require("express");
const auth = require("../../middlewares/auth");
const appConfigController = require("../../controllers/appConfig.controller");
const paymentsController = require("../../controllers/payments.controller");

const router = express.Router();

router.get("/methods", appConfigController.getPublicMethods);
router.post("/checkout", auth("common"), paymentsController.createCheckout);

module.exports = router;
