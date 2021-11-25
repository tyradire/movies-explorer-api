const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({
    owner, ...req.body,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new CastError('Переданы некорректные данные при создании фильма'));
      next(err);
    });
};

const getLikedMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => {
    if (movies.length === 0) throw new NotFoundError('Ни одного фильма не найдено');
    res.status(200).send(movies);
  })
  .catch(next);

const deleteMovie = (req, res, next) => Movie.findById(req.params.movieId)
  .then((movie) => {
    if (!movie) throw new NotFoundError('Фильм с указанным id не найден');
    if (movie.owner.toString() !== req.user._id) throw new ForbiddenError('Недостаточно прав для удаления');
    return Movie.findByIdAndRemove(req.params.movieId);
  })
  .then((movie) => res.status(200).send(movie))
  .catch(next);

module.exports = {
  createMovie, getLikedMovies, deleteMovie,
};
