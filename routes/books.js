const express = require("express");
const router = express.Router();
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/Book");
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @desc     Get All Books
 * @route    /api/books
 * @method   Get
 * @access   Public
 */
router.get("/",asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author",["_id","firstName","lastName"]);
    res.status(200).json(books);
  })
);

/**
 * @desc     Get Book By Id
 * @route    /api/book/:id
 * @method   Get
 * @access   Public
 */
router.get("/:id",asyncHandler( async(req, res) => {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      return res.status(404).json({ message: "Invalid ID" });
    } else {
      res.status(200).json(book);
    }
  })
);

/**
 * @desc     Create New Book
 * @route    /api/book
 * @method   Post
 * @access   Public
 */
router.post("/",verifyToken, asyncHandler( async (req, res) => {
  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message).end();
  }

  const book = new Book({ 
    email: req.body.email,
    description: req.body.description,
    pages: req.body.pages,
    author: req.body.author,
    price: req.body.price,
    cover:  req.body.cover
  })
  const result = await book.save()
  res.status(201).json(result);
}));

/**
 * @desc     Update a Book
 * @route    /api/books/:id
 * @method   Put
 * @access   Public
 */
router.put("/:id",verifyToken, asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message).end();
    }

    const updateBook = await Book.findByIdAndUpdate(req.params.id, {
      $set:{
        title: req.body.title,
        description: req.body.description,
        pages: req.body.pages || "",
        author: req.body.author,
        price: req.body.price || "",
        cover: req.body.cover 
      }
    } ,{new: true});
    res.status(200).json(updateBook)
  }
));

/**
 * @desc     Delete a Book
 * @route    /api/books/:id
 * @method   delete
 * @access   Public
 */
router.delete("/:id",verifyToken, asyncHandler(async(req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ massage: "The Book has been deleted." });
  } else {
    res
      .status(404)
      .json({ massage: "The Book with this id does not exist" });
  }

  
}));

  

module.exports = router;
