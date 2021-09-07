const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/user.model");
const { loginValidation } = require("../validation");
const { authVerify } = require("../middlewares/authVerify");

router
  .route("/")
  .get(authVerify, async (req, res) => {
    res.json("Hi");
  })
  .post(async (req, res) => {
    const user = req.body;
    const { error } = loginValidation(user);
    if (error) {
      return res.json({ success: false, message: error.details[0].message });
    }
    try {
      const findUser = await User.findOne({ email: user.email });
      if (!findUser) {
        return res
          .status(403)
          .json({ success: false, message: "user doesn't exists" });
      }
      const verifyUserPassowrd = await bcrypt.compare(
        user.password,
        findUser.password
      );
      if (!verifyUserPassowrd) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid Username / Password" });
      }
      const authToken = jwt.sign(
        { _id: findUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      const { password, __v, updatedAt, createdAt, ...userDetails } =
        findUser._doc;

      // console.log(userDetails);
      const userId = findUser._id.toString();
      res.status(200).json({
        success: true,
        authToken,
        userId,
        message: "User Loggedin Successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = { router };
