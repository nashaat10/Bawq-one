const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {});
exports.getUser = catchAsync(async (req, res) => {});
exports.deleteUser = catchAsync(async (req, res) => {});
