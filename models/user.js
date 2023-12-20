const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "Автор" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Автор" - 2'],
    maxlength: [30, 'Максимальная длина поля "Автор" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "Профессия" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Профессия" - 2'],
    maxlength: [30, 'Максимальная длина поля "Профессия" - 30'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "Аватар" должно быть заполнено'],
  },

},
{
  versionKey: false,
},
);

module.exports = mongoose.model('user', userSchema);
