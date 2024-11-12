const express = require("express");
const tourController = require("../controllers/tourController");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   next();
// });
router.route("/tour-stats").get(tourController.getTourStates);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/")
  .get(AuthController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    AuthController.protect,
    AuthController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
