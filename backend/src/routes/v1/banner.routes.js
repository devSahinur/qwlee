const { Router } = require("express");
const auth = require("../../middlewares/auth");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const imgbbUpload = require("../../middlewares/imgbbUpload");
const bannerImageController = require("../../controllers/banner.controller");

const upload = userFileUploadMiddleware();
const router = Router();

router.post(
  "/",
  auth("admin"),
  upload.array("images", 6),
  imgbbUpload({ optional: false }),
  bannerImageController.addBannerImage
);
router.get("/", bannerImageController.getBannerImages);
router.delete("/:bannerId", auth("admin"), bannerImageController.deleteBannerImage);

module.exports = router;
