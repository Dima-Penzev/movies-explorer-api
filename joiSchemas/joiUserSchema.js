const { Joi } = require('celebrate');

const joiUserSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
};

module.exports = joiUserSchema;
