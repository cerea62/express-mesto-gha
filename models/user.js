const mongoose = require('mongoose');
const validator = require('validator');
const { IS_URL } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "Автор" - 2'],
      maxlength: [30, 'Максимальная длина поля "Автор" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "Профессия" - 2'],
      maxlength: [30, 'Максимальная длина поля "Профессия" - 30'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (url) => IS_URL.test(url),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный Email',
      },
      required: [true, 'Поле "Email" должно быть заполнено'],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Минимальная длина поля "Пароль" - 6 символов'],
      required: [true, 'Поле "Password" должно быть заполнено'],
      select: false,
    },

  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
