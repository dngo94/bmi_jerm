const mongoose = require("mongoose")

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    dob: Date,
  })
)

module.exports = User