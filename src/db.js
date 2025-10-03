const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bookshelf', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Terhubung ke MongoDB'))
.catch(err => console.error('Koneksi MongoDB gagal: ', err));

module.exports = mongoose;