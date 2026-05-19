// Public search-tracking routes.
//
// track + trending are both reachable without auth so anonymous
// visitors are first-class citizens of the trending data. The track
// endpoint goes through optionalAuth so a logged-in user gets their
// userId stamped onto the row.

const express = require("express");
const optionalAuth = require("../../middlewares/optionalAuth");
const searchController = require("../../controllers/search.controller");

const router = express.Router();

router.post("/track", optionalAuth(), searchController.track);
router.get("/trending", searchController.trending);

module.exports = router;
