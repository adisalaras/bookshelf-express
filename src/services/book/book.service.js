const { json } = require('express');
const Books = require('../../models/books')

exports.createBook = async (req) => {
  try {
    const { body } = req;
    let { name, author, year, summary, publisher, pageCount, readPage } = body;

    if (!name) {
      const error = new Error('Gagal menambahkan buku. Mohon isi nama buku');
      error.statusCode = 400;
      throw error;
    }

    const params = {
      name,
      author,
      year,
      summary,
      publisher,
      pageCount,
      readPage,
      insertedAt: new Date(),
      updatedAt: new Date(),
    };

    const book = new Books(params);
    const savedBook = await book.save();

    return savedBook || book;
  } catch (error) {
    throw error;
  }
};
exports.updateBook = async (req) => {
  try {
    const { body } = req;
    const { bookId } = req.params;

    const { name, author, year, summary, publisher, pageCount, readPage } = body;

    const updateData = {
      name,
      author,
      year,
      summary,
      publisher,
      pageCount,
      readPage,
      updatedAt: new Date(),
    };

    const updatedBook = await Books.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });

    if (!updatedBook) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    return updatedBook;
  } catch (error) {
    throw error;
  }
};
