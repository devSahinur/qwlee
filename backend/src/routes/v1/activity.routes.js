const express = require("express");
const auth = require("../../middlewares/auth");
const activityController = require("../../controllers/activity.controller");

const router = express.Router();

// Self-report: any signed-in non-admin user (or the admin themselves)
// can post their own page-view events. The userId comes from the token
// so the body can never reference someone else.
router.post("/track", auth("common"), activityController.track);

module.exports = router;
