const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();
const appRouter = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const {
  requestLogger, errorLogger,
} = require('./middlewares/logger');

const PORT = 3000;
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://cinema.nomoredomains.work',
    'https://cinema.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));
app.use(express.json());
app.use(requestLogger);

app.use(appRouter);

app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFoundError('Был запрошен несуществующий роут'));
});
app.use(errors());
/* eslint-disable no-unused-vars, no-console */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

app.listen(PORT, () => console.log('Express is running'));
