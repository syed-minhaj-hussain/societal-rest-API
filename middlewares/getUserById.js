const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");

const getUserById = async (req, res, next, _id) => {
  try {
    const findUserById = await User.findById(_id);
    req.findUserById = findUserById;
    next();
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = { getUserById };
