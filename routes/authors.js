const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Author,
  validateUpdateAuthor,
  validateAuthor,
} = require("../models/Author");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @desc     Get All Authors
 * @route    /api/authors
 * @method   Get
 * @access   Public
 */
router.get("/", asyncHandler(async (req, res) => {
    const authorList = await Author.find();
    res.status(200).json(authorList);
  })
);

/**
 * @desc     Get Authors By Id
 * @route    /api/authors/:id
 * @method   Get
 * @access   Public
 */
router.get("/:id", asyncHandler( async (req, res) => {
      const author = await Author.findById(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Invalid ID" });
      } else {
        res.status(200).json(author);
      }
  }
));

/**
 * @desc     Create New Authors
 * @route    /api/authors
 * @method   post
 * @access   Private (only admin)
 */
router.post("/",verifyToken, asyncHandler( async (req, res) => {    
    // Validate  data
    const { error } = validateAuthor(req.body);
    if (error) {
      return res.status(404).send(error.details[0].message).end();
    }
    // Save to DB
      const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
        gender: req.body.gender,
      });
      const result = await author.save();
      res.status(201).json(result);
  }
));

/**
 * @desc     Update Authors
 * @route    /api/authors/:id
 * @method   update
 * @access   Private (only admin)
 */
router.put("/:id",verifyToken, asyncHandler( async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message).end();
    }
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ massege: "The Author is not found." }).end();
    }
    // update the fields of the author that we want to change
    author.firstName = req.body.firstName ? req.body.firstName : author.firstName;
    author.lastName = req.body.lastName ? req.body.lastName : author.lastName;
    author.nationality = req.body.nationality
      ? req.body.nationality
      : author.nationality;
    author.image = req.body.image ? req.body.image : author.image;
      const updatedAuthor = await author.save();
      res.status(200).json(updatedAuthor);
  }
));

/**
 *  @desc Delete an Author by ID
 *  @route /api/authors/:id
 *  @method DELETE
 *  @access public
 */
router.delete("/:id",verifyToken, asyncHandler( async (req, res) => {
      const author = await Author.findById(req.params.id);
      if (author) {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ massage: "The author has been deleted." });
      } else {
        res
          .status(404)
          .json({ massage: "The author with this id does not exist" });
      }
  }
));

module.exports = router;
