const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { registerValidation } = require("../validation");

router.route("/").post(async (req, res) => {
  const newUser = req.body;
  const { error } = registerValidation(newUser);
  if (error) {
    return res.json({ success: false, message: error.details[0].message });
  }
  try {
    const checkUserName = await User.findOne({ username: newUser.username });
    if (checkUserName) {
      return res
        .status(403)
        .json({ success: false, message: "username already exists" });
    }
    const checkEmail = await User.findOne({ email: newUser.email });
    if (checkEmail) {
      return res
        .status(403)
        .json({ success: false, message: "email already exists" });
    }
    const createNewUser = new User(newUser);
    const salt = await bcrypt.genSalt(10);
    createNewUser.password = await bcrypt.hash(createNewUser.password, salt);
    await createNewUser.save();
    res
      .status(201)
      .json({ success: true, message: "user created successfully!" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
});
module.exports = { router };
