const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const ordersController = require("../../controllers/orders.controller");

const router = express.Router();

// Stripe webhook — rawBody is captured by the global express.json verify
// hook (see app.js), so a route-level raw parser is unnecessary.
router.route("/webhook").post(ordersController.orderPlaced);
router
  .route("/freelancer")
  .get(auth("freelancer"), ordersController.freelancerOrdersList);

router
  .route("/checkout")
  .post(ordersController.orderCreate)
  //   .patch(auth("admin"), categoriesController.updateCategory)
  .get(auth("withOutAdmin"), ordersController.getOrders);
router
  .route("/totalIncome")
  .get(auth("withOutAdmin"), ordersController.myTotalIncome);
router
  .route("/counts")
  .get(auth("withOutAdmin"), ordersController.getOrderCounts);
router
  .route("/")
  .patch(auth("withOutAdmin"), ordersController.orderModify)
  .get(auth("withOutAdmin"), ordersController.getMyOrders);
router
.route("/:orderId")
.get(auth("withOutAdmin"), ordersController.getOrderById)
// router
//   .route("/:orderId")
//   .get(categoriesController.getCategory)
//   .delete(auth("admin"), categoriesController.deleteCategory);

module.exports = router;
