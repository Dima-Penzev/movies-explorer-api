const { HTTP_STATUS_OK } = require('node:http2').constants;
const { CastError, ValidationError } = require('mongoose').mongoose.Error;
const Movie = require('../models/movie');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => Movie.find({})
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
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм по указанному id не найден.');
      }
      if (movie.owner !== userId) {
        throw new ForbiddenError('Недостаточно прав для удаления данного фильма.');
      }
      return Movie.findByIdAndRemove(movie._id.toHexString())
        .then((removedMovie) => res.status(HTTP_STATUS_OK).send({ data: removedMovie }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные при удалении фильма.'));
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
