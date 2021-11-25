const appRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, createUser,
} = require('../controllers/users');
const {
  verify,
} = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

appRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
appRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

appRouter.use(verify);
appRouter.use(userRouter);
appRouter.use(movieRouter);

module.exports = appRouter;
