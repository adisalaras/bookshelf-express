module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Terjadi kesalahan pada server';

    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Buku tidak ditemukan';
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    res.status(statusCode).json({
        status: 'fail',
        message,
    });
};
