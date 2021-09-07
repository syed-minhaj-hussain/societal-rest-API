const express = require("express");
const { authVerify } = require("../middlewares/authVerify");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const router = express.Router();

router.route("/").get(authVerify, async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate(
      "user",
      "name username profilePicture _id"
    );
    allPosts.reverse();

    res.status(200).json({ success: true, message: "Getting Posts", allPosts });
  } catch (err) {
    res.status(404).json({ success: false, message: "posts not found" });
  }
});

module.exports = { router };
