const express = require("express");
const router = express.Router();
const User = require("../db/userModel");
const sendToken = require("../lib/jwt");
const isAuthenticated = require("../middlewares/auth.middleware.js");

router.post("/login", async (req, res, next) => {
  const { login_name, password } = req.body;
  if (!login_name || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both login name and password." });
  }
  const user = await User.findOne({ login_name, password });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid login credentials. Please try again." });
  }
  sendToken(user, 200, res);
});

router.post("/logout", async (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "You have been successfully logged out.",
  });
});

router.get("/check-auth", isAuthenticated, async (req, res, next) => {
  res.status(200).json(req.user);
});

router.post("/register", async (req, res, next) => {
  const {
    first_name,
    last_name,
    login_name,
    password,
    location,
    description,
    occupation,
  } = req.body;
  if (!first_name || !last_name || !login_name || !password) {
    return res.status(400).json({
      message: "Please fill in all required fields for registration.",
    });
  }
  const existingUser = await User.findOne({ login_name });
  if (existingUser) {
    return res.status(409).json({
      message: "This login name is already taken. Please choose another.",
    });
  }
  const newUser = new User({
    first_name,
    last_name,
    login_name,
    password,
    location,
    description,
    occupation,
  });
  await newUser.save();
  res
    .status(201)
    .json({ message: "Registration successful! You can now log in." });
});

module.exports = router;
