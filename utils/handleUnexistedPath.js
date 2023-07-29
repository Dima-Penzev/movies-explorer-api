const { NOT_FOUND_PAGE } = require('../constants/constants');
const NotFoundError = require('../errors/notFoundError');

module.exports.handleUnexistedPath = (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE));
};
