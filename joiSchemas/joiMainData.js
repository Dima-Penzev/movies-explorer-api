const { Joi } = require('celebrate');

const joiMainDataSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = joiMainDataSchema;
