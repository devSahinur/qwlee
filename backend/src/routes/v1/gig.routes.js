const express = require("express");
const auth = require("../../middlewares/auth");
const optionalAuth = require("../../middlewares/optionalAuth");
const gigController = require("../../controllers/gig.controller");
const gigLoveController = require("../../controllers/gigLove.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const imgbbUpload = require("../../middlewares/imgbbUpload");

const upload = userFileUploadMiddleware();
const router = express.Router();

// Wishlist works in both modes — a freelancer browsing as a buyer (via
// the navbar mode toggle) should also be able to save gigs. Gate by
// "common" so any signed-in non-admin can hit these.
router
  .route("/love")
  .post(auth("common"), gigLoveController.gigLove)
  .put(auth("common"), gigLoveController.gigUnlove)
  .get(auth("common"), gigLoveController.gigLoveList);
router.route("/public").get(gigController.publicGigs);
router
  .route("/image")
  .post(
    auth("freelancer"),
    upload.array("images", 6),
    imgbbUpload(),
    gigController.gigImageUpload
  );
router
  .route("/")
  .post(
    auth("freelancer"),
    upload.array("images", 6),
    imgbbUpload({ optional: false }),
    gigController.createGig
  )
  .delete(auth("freelancer"), gigController.gigSingleImageDelete)
  .get(optionalAuth(), gigController.getGigs);
router
  .route("/:gigId")
  .get(gigController.getGig)
  .patch(auth("freelancer"), gigController.updateGig)
  .delete(auth("freelancer"), gigController.deleteGig);

module.exports = router;
