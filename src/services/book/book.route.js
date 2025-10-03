const express = require('express');
const validate = require('../../middleware/validate');
const controller = require('./book.controller');
const { createBook, updateBook } = require('./book.validation');

const router = express.Router();

router
  .route('/create')
  .post(
    validate(createBook.body),
    controller.createBook,
  );
  
router
  .route('/update/:bookId')
  .post(
    validate(updateBook.body),
    controller.updateBook,
  );

module.exports = router;
