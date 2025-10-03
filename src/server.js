const express = require('express');
require('./db');
const bookRoutes = require('./services/book/book.route');

const app = express();
app.use(express.json());

app.use('/books', bookRoutes);

app.listen(9000, () => {
  console.log('Server berjalan di http://localhost:9000');
});
