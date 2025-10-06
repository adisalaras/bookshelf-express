const fs = require('fs');
const path = require('path');
const moment = require('moment');

const DATA_FILE = path.join(__dirname, '../../models/books.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  if (!data || data.trim() === '') return [];
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

exports.bookList = async (req) => {
  const { startDate, endDate } = req.query;

  const perPage = parseInt(req.query.perPage, 10) || 10;
  const page = parseInt(req.query.page, 10) - 1 || 0;
  const keyword = req.query.keyword || '';
  const reading = req.query.reading;
  const finished = req.query.finished;

  if (startDate && endDate) {
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');
    const duration = moment.duration(end.diff(start));
    const days = Math.ceil(duration.asDays());
    if (days > 31) {
      const error = new Error('Data Yang Diambil Tidak Boleh Lebih Dari 31 Hari');
      error.statusCode = 404;
      throw error;
    }
  }

  let books = readData();

  if (startDate && endDate) {
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');
    books = books.filter((b) => {
      const created = moment(b.insertedAt);
      return created.isBetween(start, end, 'day', '[]');
    });
  }

  if (keyword) {
    books = books.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword.toLowerCase()) ||
        b.author.toLowerCase().includes(keyword.toLowerCase()) ||
        b.publisher.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (reading !== undefined) {
    books = books.filter((b) => b.reading === Boolean(Number(reading)));
  }

  if (finished !== undefined) {
    books = books.filter((b) => b.finished === Boolean(Number(finished)));
  }

  const count = books.length;
  const paginatedBooks = books.slice(page * perPage, (page + 1) * perPage);

  const booksData = paginatedBooks.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  return { count, books: booksData };
};

exports.bookDetail = async (req) => {
  const { bookId } = req.params;
  const books = readData();
  const book = books.find((b) => b.id === bookId || b.bookId === bookId);
  if (!book) {
    const error = new Error('Buku tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return book;
};

exports.createBook = async (req) => {
  const { name, author, year, summary, publisher, pageCount, readPage, reading, finished } = req.body;

  const requiredFields = [
    { field: 'name', message: 'Gagal menambahkan buku. Mohon isi nama buku' },
    { field: 'author', message: 'Gagal menambahkan buku. Mohon isi author buku' },
    { field: 'year', message: 'Gagal menambahkan buku. Mohon isi tahun buku' },
    { field: 'summary', message: 'Gagal menambahkan buku. Mohon isi summary buku' },
    { field: 'publisher', message: 'Gagal menambahkan buku. Mohon isi publisher buku' },
    { field: 'pageCount', message: 'Gagal menambahkan buku. Mohon isi pageCount buku' }
  ];

  for (const { field, message } of requiredFields) {
    if (!req.body[field]) {
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
  }

  if (readPage > pageCount) {
    const error = new Error('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    error.statusCode = 400;
    throw error;
  }

  const books = readData();
  const bookId = Date.now().toString();
  const newBook = {
    id: bookId,
    bookId: bookId,
    name,
    author,
    year,
    summary,
    publisher,
    pageCount,
    readPage,
    reading: reading || false,
    finished: finished || false,
    insertedAt: new Date(),
    updatedAt: new Date(),
  };

  books.push(newBook);
  writeData(books);

  return newBook;
};

exports.updateBook = async (req) => {
  const { bookId } = req.params;
  const { name, author, year, summary, publisher, pageCount, readPage, reading, finished } = req.body;

  const requiredFields = [
    { field: 'name', message: 'Gagal menambahkan buku. Mohon isi nama buku' },
    { field: 'author', message: 'Gagal menambahkan buku. Mohon isi author buku' },
    { field: 'year', message: 'Gagal menambahkan buku. Mohon isi tahun buku' },
    { field: 'summary', message: 'Gagal menambahkan buku. Mohon isi summary buku' },
    { field: 'publisher', message: 'Gagal menambahkan buku. Mohon isi publisher buku' },
    { field: 'pageCount', message: 'Gagal menambahkan buku. Mohon isi pageCount buku' }
  ];

  for (const { field, message } of requiredFields) {
    if (!req.body[field]) {
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
  }
  
  if (readPage > pageCount) {
    const error = new Error('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    error.statusCode = 400;
    throw error;
  }

  const books = readData();
  const index = books.findIndex((b) => b.id === bookId || b.bookId === bookId);
  if (index === -1) {
    const error = new Error('Gagal memperbarui buku. Id tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  books[index] = {
    ...books[index],
    name,
    author,
    year,
    summary,
    publisher,
    pageCount,
    readPage,
    reading: reading || false,
    finished: finished || false,
    updatedAt: new Date(),
  };

  writeData(books);
  return books[index];
};

exports.bookDestroy = async (req) => {
  const { bookId } = req.params;
  const books = readData();
  const index = books.findIndex((b) => b.id === bookId || b.bookId === bookId);
  if (index === -1) {
    const error = new Error('Buku gagal dihapus. Id tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const deleted = books.splice(index, 1)[0];
  writeData(books);

  return deleted;
};
