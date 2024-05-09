const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength:5,
      maxlength:100
    },
    username:{
      type: String,
      required: true,
      trim: true,
      minlength:2,
      maxlength:200
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim:true
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Generate Token  
UserSchema.methods.generateToken = function(){
  return jwt.sign({ id: this._id, username: this.username },process.env.JWT_SECRET,{ expiresIn:"7d"});
}


// user model
const User = mongoose.model("User", UserSchema);

// validate register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.bool(),
  });
  return schema.validate(obj);
}

// validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).options({ allowUnknown: true });

  // check if the password field exists in the request body
  // if not, set it to undefined so that it will pass validation

  return schema.validate(obj);
}

// validate update user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().min(2).optional(),
    password: Joi.string().min(5).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
