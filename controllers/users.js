const User = require('../models/user');

const CREATED = 201;
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
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

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFoundError'));
    res.status(OK).send({
      name: user.name,
      about: user.about,
    });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    }
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
    res.status(OK).send({ avatar: user.avatar });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  }
};
