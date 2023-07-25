const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');
const joiMovieIdSchema = require('../joiSchemas/joiMovieIdSchema');
const joiMovieSchema = require('../joiSchemas/joiMovieSchema');

router.get('/', getMovies);

router.post('/', celebrate(joiMovieSchema), createMovie);

router.delete('/:movieId', celebrate(joiMovieIdSchema), deleteMovieById);

module.exports = router;
