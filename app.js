const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const morgan = require("morgan");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static("./public"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// used to handel all routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
