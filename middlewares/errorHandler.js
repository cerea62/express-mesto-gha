module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorMessage = statusCode === 500 ? 'На сервере произошла ошибка' : error.message;
  res.status(statusCode).send({ message: errorMessage });
  next();
};
