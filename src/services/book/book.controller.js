const service = require('./book.service');

exports.bookList = async (req, res, next) => {
  try {
    const data = await service.bookList(req);
    const result = {
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
    const data = await service.bookDetail(req);
    const result = {
      message: 'Data Loaded',
      data,
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
      message: 'Data Loaded',
      data,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.updateBook = async (req, res, next) => {
  try {
    const data = await service.updateBook(req);
    const result = {
      message: 'Data Loaded',
      data,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};