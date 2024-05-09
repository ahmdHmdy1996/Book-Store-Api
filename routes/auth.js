const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/**
 * @desc     Register New User
 * @route    /api/auth/register
 * @method   Post
 * @access   Public
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message).end();
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "Email is already registered" }).end();
    }

    // Create new user
    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin, 
    });
    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const result = await user.save();
    const token = user.generateToken()

    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

/**
 * @desc     User Login
 * @route    /api/auth/login
 * @method   Post
 * @access   private
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message).end();
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "invalid Email or Password" }).end();
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ msg: "invalid Email or Password" }).end();
    }

    const token = user.generateToken()
    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
