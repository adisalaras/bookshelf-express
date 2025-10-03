const Joi = require('joi');

module.exports = {
  createBook: {
    body: Joi.object({
      name: Joi.string().required(),
      author: Joi.string().required(),
      year: Joi.number().required(),
      summary: Joi.string().required(),
      publisher: Joi.string().required(),
    }),
  },
  updateBook: {
    body: Joi.object({
      name: Joi.string(),
      author: Joi.string(),
      year: Joi.number(),
      summary: Joi.string(),
      publisher: Joi.string(),
    }),
  },
};
