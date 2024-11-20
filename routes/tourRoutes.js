const express = require("express");
const tourController = require("../controllers/tourController");
const AuthController = require("../controllers/AuthController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   next();
// });

// merge routes
router.use("/:tourId/reviews", reviewRouter);

router.route("/tour-stats").get(tourController.getTourStates);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getTourWithin);

router.route("/distances/:latlng/unit").get(tourController.getDistances);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    AuthController.protect,
    AuthController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    AuthController.protect,
    AuthController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
