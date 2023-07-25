const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
