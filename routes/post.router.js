const express = require("express");
const router = express.Router();
const cors = require("cors");

const { authVerify } = require("../middlewares/authVerify");
const { headers } = require("../middlewares/headers");
const { Post } = require("../models/post.model");
const { postValidation } = require("../validation");

router.use("/", authVerify);
router.route("/").post(async (req, res) => {
  const user = req.user;
  const newPost = req.body;
  const { error } = postValidation(newPost);
  if (error) {
    return res.json({ success: false, message: error.details[0].message });
  }
  const savedPost = new Post({ ...newPost, user: user._id });
  try {
    await savedPost.save();
    res
      .status(200)
      .json({ success: true, message: "You Just Created a Post!!", savedPost });
  } catch (err) {
    res.status(500).json(err);
  }
});

router
  .route("/:postId")
  .get(async (req, res) => {
    const { postId } = req.params;
    try {
      const getPost = await Post.findById(postId);
      if (!getPost) {
        return res
          .status(404)
          .json({ success: false, message: "Post Dosen't Exists!!" });
      }
      res.status(200).json({ success: true, message: "Post Found!", getPost });
    } catch (err) {
      res.status(500).json(err);
    }
  })
  .post(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;
    const updatedPost = req.body;
    const { error } = postValidation(updatedPost);
    if (error) {
      return res.json({ success: false, message: error.details[0].message });
    }
    try {
      const checkIfPostAvailable = await Post.findById(postId);
      if (!checkIfPostAvailable) {
        return res
          .status(404)
          .json({ success: false, message: "post doesn't exists!" });
      }
      if (user._id === checkIfPostAvailable.user.toString()) {
        console.log("treu");
        await checkIfPostAvailable.updateOne({
          $set: updatedPost,
        });
        res.status(200).json({ success: true, message: "Post Updated!" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You Can't Update Other's Post!!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
  .delete(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;
    try {
      const checkIfPostAvailable = await Post.findById(postId);
      if (!checkIfPostAvailable) {
        return res
          .status(404)
          .json({ success: false, message: "post doesn't exists!" });
      }
      if (user._id === checkIfPostAvailable.user.toString()) {
        await checkIfPostAvailable.deleteOne();
        res.status(200).json({ success: true, message: "Post Deleted!" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You Can't Delete Other's Post!!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.route("/:postId/like").post(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
  headers,
  async (req, res) => {
    const { id } = req.body;
    const { _id } = req.user;
    const { postId } = req.params;
    // console.log({ postId });
    // console.log({ _id });
    // console.log({ bodyId: id });
    try {
      const getPostById = await Post.findById(postId);
      if (_id === getPostById.user.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "You Can't Like Yourself!" });
      }
      if (!getPostById.likes.includes(_id)) {
        await getPostById.updateOne({ $push: { likes: _id } });
        res.status(200).json({ success: true, message: "Post Liked!" });
      } else {
        await getPostById.updateOne({ $pull: { likes: _id } });
        res.status(200).json({ success: true, message: "Post Unliked!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
module.exports = { router };
