const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie, getLikedMovies, deleteMovie,
} = require('../controllers/movies');
const {
  urlValidator,
} = require('../validator/validator');

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(50),
    director: Joi.string().required().min(2).max(100),
    duration: Joi.number().required().min(1).max(500),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(1000),
    image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required().min(1).max(1000),
    nameRU: Joi.string().required().min(2).max(100)
      .regex(/^[А-Яа-яёЁ.^%$#!~@'"`,-\w\s]+$/),
    nameEN: Joi.string().required().min(2).max(100)
      .regex(/^[\w.^%$#!~@'"`,-\d\s]+$/),
  }),
}), createMovie);

movieRouter.get('/movies', getLikedMovies);

movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
