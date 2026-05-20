const express = require("express");
const auth = require("../../middlewares/auth");
const adminController = require("../../controllers/admin.controller");
const activityController = require("../../controllers/activity.controller");
const router = express.Router();
router.get("/getTotalStatus", auth("admin"), adminController.getTotalStatus);
router.get("/getIncomeRatio", auth("admin"), adminController.getIncomeRatio);
router.get("/getUserRatio", auth("admin"), adminController.getUserRatio);
router.get("/recentUsers", auth("admin"), adminController.getRecentUsers);
router.get("/earnings", auth("admin"), adminController.getAllEarning);
router.get("/orders", auth("admin"), adminController.getAllOrders);
router.get("/gigs", auth("admin"), adminController.getAllGigs);

// Per-user activity feed (timeline + per-route + per-IP rollups) for
// the admin "monitor user" page.
router.get(
  "/user-activity/:userId",
  auth("admin"),
  activityController.getUserActivity
);

// Ban / unban a user. Ban payload accepts an optional `reason` string.
router.patch("/users/:userId/ban", auth("admin"), adminController.banUser);
router.patch("/users/:userId/unban", auth("admin"), adminController.unbanUser);

// Admin search logs — every marketplace query (anonymous + authed).
const searchController = require("../../controllers/search.controller");
router.get("/searches", auth("admin"), searchController.list);
router.get("/search-stats", auth("admin"), searchController.adminStats);

// Platform settings — payment provider credentials, SMTP, custom
// methods, misc. Admin-only since these contain secrets.
const appConfigController = require("../../controllers/appConfig.controller");
router.get("/settings", auth("admin"), appConfigController.getSettings);
router.patch("/settings", auth("admin"), appConfigController.updateSettings);
router.post(
  "/settings/custom-payments",
  auth("admin"),
  appConfigController.addCustomPayment
);
router.delete(
  "/settings/custom-payments/:id",
  auth("admin"),
  appConfigController.removeCustomPayment
);

// Read-only access to platform conversations (DMs + order chats) for
// moderation. No write endpoints — admins observe, they don't post.
const adminChatsController = require("../../controllers/adminChats.controller");
router.get("/chats", auth("admin"), adminChatsController.listDirectChats);
router.get(
  "/chats/:chatId/messages",
  auth("admin"),
  adminChatsController.getDirectChat
);
router.get("/order-chats", auth("admin"), adminChatsController.listOrderChats);
router.get(
  "/order-chats/:orderId/messages",
  auth("admin"),
  adminChatsController.getOrderChat
);

module.exports = router;
