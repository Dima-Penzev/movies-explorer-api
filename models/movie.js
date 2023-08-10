const mongoose = require('mongoose');
const { INVALID_LINK } = require('../constants/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => /http(s|\b):\/\/.+\.\w+.+/.test(v),
      message: (props) => `${props.value} - ${INVALID_LINK}`,
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => /http(s|\b):\/\/.+\.\w+.+/.test(v),
      message: (props) => `${props.value} - ${INVALID_LINK}`,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => /http(s|\b):\/\/.+\.\w+.+/.test(v),
      message: (props) => `${props.value} - ${INVALID_LINK}`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
