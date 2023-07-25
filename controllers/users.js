const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('node:http2').constants;
const { CastError, ValidationError } = require('mongoose').mongoose.Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя.',
          ),
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', {
        expiresIn: '7d',
      });
      return res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некоректный id пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateUserInfoById = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя.',
          ),
        );
      } else {
        next(err);
      }
    });
};

const logOut = async (req, res, next) => {
  try {
    await res.status(HTTP_STATUS_OK).clearCookie('jwt').send({ massege: 'Вы вышли из своей учетной записи.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  login,
  getUserInfo,
  updateUserInfoById,
  logOut,
};
