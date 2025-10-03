const express = require('express');
const validate = require('../../middleware/validate');
const controller = require('./book.controller');
const { createBook, updateBook } = require('./book.validation');

const router = express.Router();

router
  .route('/')
  .get(
    controller.bookList,
  );

router
  .route('/:bookId')
  .get(
    controller.bookDetail,
  );

router
  .route('/:bookId')
  .delete(
    controller.bookDestroy,
  );

router
  .route('/')
  .post(
    validate(createBook.body),
    controller.createBook,
  );

router
  .route('/:bookId')
  .put(
    validate(updateBook.body),
    controller.updateBook,
  );

module.exports = router;
