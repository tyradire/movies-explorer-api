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
const {
  sendError,
} = require('./middlewares/sendError');
const limiter = require('./middlewares/rateLimiter');

const {
  NODE_ENV,
  DB_URL,
} = process.env;

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
app.use(limiter);
app.use(appRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Был запрошен несуществующий роут'));
});

app.use(errorLogger);
app.use(errors());
app.use(sendError);

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb', { useNewUrlParser: true });

app.listen(PORT, () => console.log('Express is running'));
