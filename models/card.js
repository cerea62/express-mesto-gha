const mongoose = require('mongoose');

const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "Место" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "Место" - 2'],
      maxlength: [30, 'Максимальная длина поля "Место" - 30'],
    },
    link: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{
      type: ObjectId,
      default: [],
    }],
    createAT: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
