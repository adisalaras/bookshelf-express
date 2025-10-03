const { json } = require('express');
const moment = require('moment');
const Books = require('../../models/books')

exports.bookList = async (req) => {
  try {
    const {
      startDate = moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate = moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
    } = req.query;
    const filter = {};
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = parseInt(req.query.page, 10) - 1 || 0;
    const keyword = req.query.keyword || '';

    if (req.query.startDate && req.query.endDate) {
      const start = moment(startDate, 'YYYY-MM-DD');
      const end = moment(endDate, 'YYYY-MM-DD');
      const duration = moment.duration(end.diff(start));
      const days = Math.ceil(duration.asDays());
      if (days > 31) {
        const error = new Error('Data Yang Diambil Tidak Boleh Lebih Dari 31 Hari');
        error.statusCode = 404;
        throw error;
      }

      const createdAt = {
        $gte: start.startOf('day').toDate(),
        $lt: end.endOf('day').toDate(),
      };
      filter.createdAt = createdAt;
    }

    if (keyword) {
      filter.$or = [
        { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        { author: { $regex: `.*${keyword}.*`, $options: 'i' } },
        { publisher: { $regex: `.*${keyword}.*`, $options: 'i' } }
      ];
    }

    const count = await Books.countDocuments(filter);
    const books = await Books.find(filter, null, {
      sort: { createdAt: -1 },
    })
      .skip(perPage * page)
      .limit(perPage);

    return {
      count,
      data: books,
    };
  } catch (error) {
    throw error;
  }
};

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
