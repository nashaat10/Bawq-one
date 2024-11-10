const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "please provide a valid email "],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Enter your password"],
    minLength: 4,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm your password"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
