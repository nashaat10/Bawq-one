const express = require("express");
const userController = require("../controllers/userController");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

router.post("/signUp", AuthController.signUp);
router.route("/").get(userController.getAllUsers);
// .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
