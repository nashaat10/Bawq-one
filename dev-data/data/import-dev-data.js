const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModel");
// const User = require("../../models/userModel");
// const Review = require("../models/reviewModel");
// console.log(app.get("env"));

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URL;

// console.log(DB);
mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// const reviews = JSON.parse(fs.readFileSync("../data/reviews.json", "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log("Data loaded successfully");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log("Data deleted successfully");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

//node ..\data\import-dev-data.js --import
//node dev-data/data/import-dev-data
