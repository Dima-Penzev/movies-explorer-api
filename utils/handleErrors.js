const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('node:http2').constants;

module.exports.handleErrors = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка.'
        : message,
    });

  next();
};