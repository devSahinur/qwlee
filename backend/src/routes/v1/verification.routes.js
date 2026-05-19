// Verification routes — seller submits NID / passport, admin reviews.
//
// Submit accepts three named files (front / back / selfie) so we use
// multer's `.fields(...)` shape. The generic imgbbUpload middleware
// only handles req.file / req.files-as-array, so we run uploadMany
// manually here per field key.

const express = require("express");
const auth = require("../../middlewares/auth");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const imageUploadService = require("../../services/imageUpload.service");
const verificationController = require("../../controllers/verification.controller");

const router = express.Router();
const upload = userFileUploadMiddleware();

const FIELDS = upload.fields([
  { name: "front", maxCount: 1 },
  { name: "back", maxCount: 1 },
  { name: "selfie", maxCount: 1 },
]);

async function pushToImgbb(req, _res, next) {
  try {
    const files = req.files || {};
    const tasks = [];
    for (const key of Object.keys(files)) {
      for (const file of files[key]) {
        tasks.push(
          imageUploadService.uploadOne(file).then((r) => {
            Object.assign(file, {
              cloudUrl: r.url,
              displayUrl: r.displayUrl,
              thumbUrl: r.thumbUrl,
              deleteUrl: r.deleteUrl,
              buffer: undefined,
            });
          })
        );
      }
    }
    await Promise.all(tasks);
    next();
  } catch (err) {
    next(err);
  }
}

router.post(
  "/submit",
  auth("common"),
  FIELDS,
  pushToImgbb,
  verificationController.submit
);

// Admin review endpoints.
router.get("/", auth("admin"), verificationController.list);
router.patch("/:userId", auth("admin"), verificationController.review);

module.exports = router;
