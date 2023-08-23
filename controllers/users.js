const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require("node:http2").constants;
const { CastError, ValidationError } = require("mongoose").mongoose.Error;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ConflictError = require("../errors/conflictError");
const {
  EXISTED_USER,
  INCORRECT_USER_DATA,
  NOT_FOUND_USER,
  INCORRECT_USER_ID,
  PROFILE_EXIT,
} = require("../constants/constants");

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      })
    )
    .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(EXISTED_USER));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError(INCORRECT_USER_DATA));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "secret-key",
        {
          expiresIn: "7d",
        }
      );
      return res
        .status(HTTP_STATUS_OK)
        .cookie("jwt", token, { maxAge: 3600000, httpOnly: true })
        .send({ data: user });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_USER);
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(INCORRECT_USER_ID));
      } else {
        next(err);
      }
    });
};

const updateUserInfoById = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user && user._id.toString() !== userId) {
        throw new ConflictError(EXISTED_USER);
      }
      return User.findByIdAndUpdate(
        userId,
        { email, name },
        { new: true, runValidators: true }
      ).then((updataedUser) => {
        if (!updataedUser) {
          throw new NotFoundError(NOT_FOUND_USER);
        }
        return res.status(HTTP_STATUS_OK).send({ data: updataedUser });
      });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(INCORRECT_USER_DATA));
      } else {
        next(err);
      }
    });
};

const logOut = async (req, res, next) => {
  try {
    await res
      .status(HTTP_STATUS_OK)
      .clearCookie("jwt")
      .send({ massege: PROFILE_EXIT });
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
