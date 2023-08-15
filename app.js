const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { handleErrors } = require('./utils/handleErrors');
const limiter = require('./utils/limiter');

const { NODE_ENV, PORT = 3000, DB_HOST } = process.env;

const app = express();

app.use(helmet());

app.use(limiter);

app.use(cookieParser());

mongoose
  .connect(
    NODE_ENV === 'production' ? DB_HOST : 'mongodb://0.0.0.0:27017/bitfilmsdb',
    {
      useNewUrlParser: true,
    },
  )
  .then(() => {
    console.log('База данных успешно подключена.');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
