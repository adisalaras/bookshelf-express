const mongoose = require('mongoose');

/**
 * Request Adjustment Schema
 * @private
 */
const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      index: true,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
      default: 0,
    },
    summary: {
      type: String,
      required: true,
      index: true,
    },
    publisher: {
      type: String,
      required: true,
      index: true,
    },
    pageCount: {
      type: Number,
      required: false,
      index: true,
    },
    readPage: {
      type: Number,
      required: false,
      index: true,
    },
    reading: {
      type: Boolean,
      required: false,
      index: true,
      default: false
    },
    finished: {
      type: Boolean,
      required: true,
      index: true,
      default: false
    },
    insertedAt: {
      type: Date,
      required: false,
      index: true,
    },
    updatedAt: {
      type: Date,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

bookSchema.set('toJSON', {
  virtuals: true,
  versionKey: true,
  transform: (doc, data) => {
    const transformed = {};
    const fields = [
      'id',
      'name',
      'author',
      'year',
      'summary',
      'publisher',
      'pageCount',
      'readPage',
      'reading',
      'finished',
      'insertedAt',
      'updatedAt',
    ];

    fields.forEach((field) => {
      transformed[field] = data[field];
    });

    return transformed;
  },
});

bookSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'name',
      'author',
      'year',
      'summary',
      'publisher',
      'pageCount',
      'readPage',
      'reading',
      'finished',
      'insertedAt',
      'updatedAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

module.exports = mongoose.model('books', bookSchema);
