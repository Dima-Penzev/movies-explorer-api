const { Joi } = require('celebrate');

const joiMovieIdSchema = {
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = joiMovieIdSchema;
