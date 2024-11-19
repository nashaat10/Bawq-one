const express = require("express");
const userController = require("../controllers/userController");
const AuthController = require("../controllers/AuthController");
const multer = require("multer");

const upload = multer({ dest: "public/img/users" });

const router = express.Router();

router.post("/signUp", AuthController.signUp);
router.post("/login", AuthController.login);

router.get(
  "/me",
  AuthController.protect,
  userController.getMe,
  userController.getUser
);

router.post("/forgetPassword", AuthController.forgetPassword);
router.patch("/resetPassword/:token", AuthController.resetPassword);

router.route("/").get(userController.getAllUsers);
// .post(userController.createUser);
router.patch("/updateMe", AuthController.protect, userController.updateMe);
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
