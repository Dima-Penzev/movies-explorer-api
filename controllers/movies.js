const { HTTP_STATUS_OK } = require('node:http2').constants;
const { CastError, ValidationError } = require('mongoose').mongoose.Error;
const Movie = require('../models/movie');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const {
  INCORRECT_MOVIE_DATA, NOT_FOUND_MOVIE, NOT_ENOUGH_RIGHTS, INCORRECT_REMOVAL_DATA,
} = require('../constants/constants');

const getMovies = (req, res, next) => Movie.find({})
  .populate(['owner'])
  .then((movies) => res.status(HTTP_STATUS_OK).send({ data: movies }))
  .catch(next);

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newCard) => res.status(HTTP_STATUS_OK).send({ data: newCard }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(INCORRECT_MOVIE_DATA));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  return Movie.findById(movieId)
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_MOVIE);
      }
      if (movie.owner._id.toString() !== userId) {
        throw new ForbiddenError(NOT_ENOUGH_RIGHTS);
      }
      return Movie.findByIdAndRemove(movie._id.toString())
        .then((removedMovie) => res.status(HTTP_STATUS_OK).send({ data: removedMovie }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(INCORRECT_REMOVAL_DATA));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
