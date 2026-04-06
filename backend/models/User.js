// In your User model (e.g., User.js), add these fields:
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }, // To store the time until which the account is locked
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
