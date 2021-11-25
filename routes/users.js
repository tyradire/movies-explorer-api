const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, editUserInfo,
} = require('../controllers/users');

userRouter.get('/users/me', getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), editUserInfo);

module.exports = userRouter;
