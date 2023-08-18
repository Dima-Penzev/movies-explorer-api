const { Joi } = require("celebrate");

const joiMovieIdSchema = {
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
};

module.exports = joiMovieIdSchema;
