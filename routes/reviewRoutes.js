const express = require("express");
const reviewController = require("../controllers/reviewController");
const AuthController = require("../controllers/AuthController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    AuthController.protect,
    AuthController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;
