const NotFoundError = require('../errors/notFoundError');

module.exports.handleUnexistedPath = (req, res, next) => {
  next(new NotFoundError('Нет страницы по указанному пути.'));
};
