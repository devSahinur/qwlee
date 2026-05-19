const express = require("express");
const auth = require("../../middlewares/auth");
const categoriesController = require("../../controllers/categories.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPng = require("../../middlewares/converter");
const imgbbUpload = require("../../middlewares/imgbbUpload");

const upload = userFileUploadMiddleware();
const router = express.Router();

router
  .route("/")
  .post(
    auth("admin"),
    upload.single("image"),
    convertHeicToPng(),
    imgbbUpload(),
    categoriesController.createCategory
  )
  .patch(
    auth("admin"),
    upload.single("image"),
    convertHeicToPng(),
    imgbbUpload(),
    categoriesController.updateCategory
  )
  .get(categoriesController.getCategories);

router
  .route("/:categoryId")
  .get(categoriesController.getCategory)
  .delete(auth("admin"), categoriesController.deleteCategory);

module.exports = router;
