const AppError = require("../utils/AppError");
const handelCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handelValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data.${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error🥚", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const handelJwtError = () =>
  new AppError("Invalid token. Please log in again", 401);

const handelJwtExpired = () =>
  new AppError("Token has been expired. Please log in again", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err; // can't use destructuring like {...err}

    console.log(error.name);
    if (error.name === "CastError") error = handelCastError(error);
    if (error.code === 11000) error = handelDuplicateFields(error);
    if (error.name === "ValidationError") error = handelValidationError(error);
    if (error.name === "JsonWebTokenError") error = handelJwtError();
    if (error.name === "TokenExpiredError") error = handelJwtExpired();

    sendErrorProd(error, res);
  }
};
