const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { authVerify } = require("../middlewares/authVerify");
const { getUserById } = require("../middlewares/getUserById");

router.use("/", authVerify);
router.param("_id", getUserById);
router
  .route("/:_id")
  .get(async (req, res) => {
    const { _id } = req.params;
    const { findUserById } = req;
    try {
      const getAllPostsOfUser = await Post.find({ user: _id });
      const {
        password,
        createdAt,
        updatedAt,
        followers,
        following,
        __v,
        ...rest
      } = findUserById._doc;
      const userFollowers = await Promise.all(
        findUserById.followers.map((userId) => User.findById(userId))
      );
      const userFollowing = await Promise.all(
        findUserById.following.map((userId) => User.findById(userId))
      );
      const myFollowing = userFollowing?.map(
        ({
          _doc: {
            password,
            __v,
            createdAt,
            updatedAt,
            followers,
            following,
            coverPicture,
            email,
            ...user
          },
        }) => user
      );
      const myFollowers = userFollowers?.map(
        ({
          _doc: {
            password,
            __v,
            createdAt,
            updatedAt,
            followers,
            following,
            coverPicture,
            location,
            description,
            email,
            ...user
          },
        }) => user
      );
      res.status(201).json({
        success: true,
        message: "User Found",
        rest,
        myFollowers,
        myFollowing,
        getAllPostsOfUser,
      });
    } catch (err) {
      res.status(404).json({ err });
    }
  })
  .post(async (req, res) => {
    const { _id } = req.params;
    const user = req.user;
    if (_id !== user._id) {
      return res.status(200).json({
        success: false,
        message: "You Can't Update Other User's Credentials",
      });
    }
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      if (req.body.username) {
        const findUserByUsername = await User.findOne({
          username: req.body.username,
        });
        if (findUserByUsername) {
          return res
            .status(401)
            .json({ success: false, message: "Username ALready Exists" });
        }
      }

      if (req.body.email) {
        const findUserByEmail = await User.findOne({
          email: req.body.email,
        });
        if (findUserByEmail) {
          return res
            .status(401)
            .json({ success: false, message: "Email ALready Exists" });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something Went Wrong, Please Try Afetr Sometime",
      });
    }

    try {
      const updateUser = await User.findByIdAndUpdate(user._id, {
        $set: req.body,
      });
      res
        .status(200)
        .json({ success: true, message: "User Updated Successfully" });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong,",
      });
    }
  })
  .delete(async (req, res) => {
    const { _id } = req.params;
    const user = req.user;
    if (_id !== user._id) {
      return res.status(200).json({
        success: false,
        message: "You Can't Delete Other Users!!",
      });
    }
    try {
      const deleteUser = await User.deleteOne({ _id });
      res
        .status(200)
        .json({ success: true, message: "user deleted successfully!" });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong,",
      });
    }
  });

router.use("/:_id/follow", authVerify);
router.route("/:_id/follow").post(async (req, res) => {
  const { _id } = req.params;
  const user = req.user;
  // console.log({ _id, user });
  if (_id !== user._id) {
    try {
      const getCurrentUser = await User.findById(user._id);
      const getParamsUser = await User.findById(_id);
      if (!getParamsUser.followers.includes(user._id)) {
        await getParamsUser.updateOne({ $push: { followers: user._id } });
        await getCurrentUser.updateOne({ $push: { following: _id } });

        res
          .status(200)
          .json({ success: true, message: "You Just Followed One User" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You Already Follow This User" });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something Went Wrong,",
      });
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "You Can't Follow Yourself!!" });
  }
});

router.use("/:_id/unfollow", authVerify);
router.route("/:_id/unfollow").post(async (req, res) => {
  const { _id } = req.params;
  const user = req.user;
  if (_id !== user._id) {
    try {
      const getCurrentUser = await User.findById(user._id);
      const getParamsUser = await User.findById(_id);
      if (getParamsUser.followers.includes(user._id)) {
        await getParamsUser.updateOne({ $pull: { followers: user._id } });
        await getCurrentUser.updateOne({ $pull: { following: _id } });
        res
          .status(200)
          .json({ success: true, message: "You Just unFollowed One User" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You Don't Follow This User" });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something Went Wrong,",
      });
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "You Can't unFollow Yourself!!" });
  }
});

module.exports = { router };
