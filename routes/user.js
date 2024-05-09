const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const {
  verifyToken
} = require("../middlewares/verifyToken");

/**
 * @desc     update user
 * @route    /api/users
 * @method   Put
 * @access   Public
 */
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ massage: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updateUser);
  })
);


/**
 * @desc     get all user
 * @route    /api/users
 * @method   Get
 * @access   Public
 */
router.get("/", verifyToken, asyncHandler(async (req,res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users)
}))

/**
 * @desc     Get user by id
 * @route    /api/users/:Id
 * @method   Get
 * @access   private admin or user himself
 */
router.get("/:id", verifyToken, asyncHandler(async (req,res) =>{
  const user = await User.findById(req.params.id).select("-password");
  if (user){
    res.status(200).json(user);
  }else {
    res.status(404).json({message: "User not found"});
  }
}))

/**
 * @desc     Get user by id and delete
 * @route    /api/users/:Id
 * @method   Delete
 * @access   private admin or user himself
 */
router.delete("/:id", verifyToken, asyncHandler(async (req,res) =>{
  const user = await User.findById(req.params.id).select("-password");
  if (user){
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message : "user has been deleted successfully"});
  }else {
    res.status(404).json({message: "User not found"});
  }
}))

module.exports = router;
