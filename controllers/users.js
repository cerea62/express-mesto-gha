const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');
const { SECRET_KEY } = require('../utils/constants');

const CREATED = 201;
const OK = 200;
const MONGO_DUPLICATE_ERROR = 11000;

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (!password) {
      throw new ValidationError('Поле Password не заполнено');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR) {
      next(new ConflictError('Такой пользователь уже существует'));
    }
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password')
      .orFail(new AccessError('Неправильные имя пользователя или пароль'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AccessError('Неправильные имя пользователя или пароль');
    }
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    return res.status(OK).send({
      token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => new NotFoundError('Пользователь по указанному ID не найден'));
    return res.status(OK).send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('Передан некорректный Id'));
    }
    return next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(() => new NotFoundError('Пользователь по указанному ID не найден'));
    return res.status(OK).send({ data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .orFail(() => new NotFoundError('Пользователь по указанному ID не найден'));
    return res.status(OK).send({
      name: user.name,
      about: user.about,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Передан некорректный Id'));
    }
    return next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .orFail(() => new NotFoundError('Пользователь по указанному ID не найден'));
    return res.status(OK).send({ avatar: user.avatar });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Передан некорректный Id'));
    }
    return next(error);
  }
};
