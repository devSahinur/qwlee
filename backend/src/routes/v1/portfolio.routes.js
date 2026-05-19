const express = require("express");
const auth = require("../../middlewares/auth");
const portfolioController = require("../../controllers/portfolio.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const imgbbUpload = require("../../middlewares/imgbbUpload");

const upload = userFileUploadMiddleware();
const router = express.Router();

router
  .route("/")
  .post(
    auth("freelancer"),
    upload.single("image"),
    imgbbUpload({ optional: false }),
    portfolioController.createPortfolio
  )
  .get(portfolioController.getPortfolios);

router
  .route("/:portfolioId")
  .delete(auth("freelancer"), portfolioController.deletePortfolioById);

module.exports = router;
