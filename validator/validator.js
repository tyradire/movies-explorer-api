const validator = require('validator');
const CastError = require('../errors/CastError');

const urlValidator = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new CastError('Переданы некорректные данные');
};

module.exports = {
  urlValidator,
};
