const express = require('express');
const bookRoutes = require('./services/book/book.route');
const errorHandler = require('./middleware/error-handler');

const app = express();
app.use(express.json());

app.use('/books', bookRoutes);
app.use(errorHandler);

app.listen(9000, () => {
  console.log('Server berjalan di http://localhost:9000');
});
