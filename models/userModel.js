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
    lowerCase: true,
    validate: [validator.isEmail, "please provide a valid email "],
    unique: true,
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
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", function (next) {});

const User = mongoose.model("User", userSchema);

module.exports = User;
