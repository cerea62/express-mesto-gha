const jwt = require('jsonwebtoken');
const AccessError = require('../errors/AccessError');

// const UNAUTHORIZED = 401;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new AccessError('Неправильные имя пользователя или пароль');
    }
    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, 'super-strong-secret');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return new AccessError({ message: 'С токеном что-то не так' });
    }
  }
  req.user = payload;
  return next();
};
