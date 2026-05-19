const express = require("express");
const auth = require("../../middlewares/auth");
const notificationController = require("../../controllers/notification.controller");

const router = express.Router();

router
  .route("/")
  .get(auth("common"), notificationController.getALLNotification);

// Bulk "mark all as read" — must live above /:id so Express doesn't
// treat "read-all" as a notification id.
router
  .route("/read-all")
  .post(auth("common"), notificationController.readAllNotifications);

router
  .route("/admin")
  .get(auth("admin"), notificationController.getALLNotificationAdmin);

// Auth required — previously this route was unprotected, meaning any
// caller who knew a notification id could flip its viewStatus.
router
  .route("/:id")
  .post(auth("common"), notificationController.readNotification)
  .delete(auth("common"), notificationController.deleteNotificationById);
// .post(auth("admin"), notificationController.readNotificationAdmin)

module.exports = router;
