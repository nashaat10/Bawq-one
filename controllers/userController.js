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

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new AppError("no user found with this id ", 401));
  }

  res.status(200).json({
    status: "success",
    user: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.updateUser = catchAsync(async (req, res) => {});
