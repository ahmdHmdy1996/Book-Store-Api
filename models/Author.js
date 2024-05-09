const mongoose = require("mongoose");
const Joi = require("joi");
  

const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlenght: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Not specified",
    },
    image: {
      type: String,
      description: String,
      default: "avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

// Validate Create new authors
function validateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    gender: Joi.string().required().valid("Male", "Female"),
    nationality: Joi.string().min(3),
    image: Joi.string(),
  });
  return schema.validate(author);
}

// Validate update authors
function validateUpdateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    nationality: Joi.string().min(3),
    image: Joi.string(),
  });
  return schema.validate(author);
}
module.exports = {
  Author,
  validateUpdateAuthor,
  validateAuthor,
};
