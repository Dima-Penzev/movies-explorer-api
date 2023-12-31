const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorizedError');
const { WRONG_DATA, WRONG_EMAIL_FORMAT } = require('../constants/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: (v) => isEmail(v),
      message: WRONG_EMAIL_FORMAT,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const itemRet = ret;
    delete itemRet.password;
    return itemRet;
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(WRONG_DATA));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(WRONG_DATA));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
