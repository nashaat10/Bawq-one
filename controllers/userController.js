const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const redis = require("redis");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1]; // jbg
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.log(err);
});
redisClient.connect();

const multerStorage = multer.memoryStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image,please upload an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.getAllUsers = catchAsync(async (_req, res, _next) => {
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
  const userId = req.params.id;
  // console.time("redis");
  const cashedUser = await redisClient.get(userId);
  // console.timeEnd("redis");
  if (cashedUser) {
    console.log("cache hit");
    const user = JSON.parse(cashedUser);
    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }

  console.log("cache miss");

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("no user found with this id ", 401));
  }

  await redisClient.setEx(userId, 180, JSON.stringify(user));

  res.status(200).json({
    status: "success",
    user: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError("you cant update your password using this route", 400)
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");

  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "message",
    user: {
      updatedUser,
    },
  });
});
