const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');

const CREATED = 201;
const OK = 200;
const MONGO_DUPLICATE_ERROR = 11000;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const UNAUTHORIZED = 401;

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
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
      // return res.status(CONFLICT).send({ message: 'Такой пользователь уже существует' });
    }
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные'));
      // return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    // return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AccessError('Неправильные имя пользователя или пароль');
    }
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    return res.status(OK).send({
      token,
    });
  } catch (error) {
    next(error);
  }
    // if (error.message === 'Not_Authentication') {
    //   return res.status(UNAUTHORIZED).send({ message: 'Неправильные имя пользователя или пароль' });
    // }
  //   return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  // }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => new Error('NotFoundError'));
    return res.status(OK).send({ data: user });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан некорректный Id' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};
module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => new Error('NotFoundError'));
    return res.status(OK).send({ data: user });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFoundError'));
    return res.status(OK).send({
      name: user.name,
      about: user.about,
    });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFoundError'));
    return res.status(OK).send({ avatar: user.avatar });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};


