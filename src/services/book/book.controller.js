const service = require('./book.service');

exports.bookList = async (req, res, next) => {
  try {
    const data = await service.bookList(req);
    const result = {
      status: 'success',
      message: 'Data Loaded',
      data,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.bookDetail = async (req, res, next) => {
  try {
    const book = await service.bookDetail(req);
    const result = {
      status: 'success',
      message: 'Data Loaded',
      data: {
        book,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const data = await service.createBook(req);
    const result = {
      status: 'success',
      message: 'Buku berhasil ditambahkan ',
      data,
    };
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const data = await service.updateBook(req);
    const result = {
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.bookDestroy = async (req, res, next) => {
  try {
    const data = await service.bookDestroy(req);
    const result = {
      status: 'success',
      message: 'Buku berhasil dihapus',
      data,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};