const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name Cannot Be Empty",
      min: 5,
      max: 30,
    },
    username: {
      type: String,
      required: "Userame Cannot Be Empty",
      min: 5,
      max: 30,
      unique: true,
    },
    email: {
      type: String,
      required: "email Cannot Be Empty",
      min: 5,
      max: 30,
      unique: true,
    },
    password: {
      type: String,
      min: 5,
      max: 30,
      required: "password cannot be empty!!",
    },
    profilePicture: {
      type: String,
      default: "https://i.ibb.co/RztnCHv/user.png",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
