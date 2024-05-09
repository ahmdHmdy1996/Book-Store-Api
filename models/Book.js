const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/150", //default image if no other is provided
    },
    pages: Number,
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

// Validate Create Book
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().min(3).max(200).required(),
    author: Joi.string().trim().min(3).required(),
    pages: Joi.number().integer().required(),
    price: Joi.number().min(0.01).required(),
    cover: Joi.string(),
  });
  return schema.validate(obj);
}

// Validate Update Book
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    description: Joi.string().trim().min(3).max(200),
    author: Joi.string().trim().min(3),
    pages: Joi.number().integer(),
    price: Joi.number().min(0.01),
    cover: Joi.string(),
  });
  return schema.validate(obj);  
}

module.exports = { Book, validateCreateBook, validateUpdateBook };
