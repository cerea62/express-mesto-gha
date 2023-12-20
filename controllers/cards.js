const Card = require('../models/card');

const CREATED = 201;
const OK = 200;
const BAD_REQUEST = 400;
const ACCESS_ERROR = 401;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED).send({
      name: card.name,
      link: card.link,
      owner: card.owner,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.status(OK).send({ card });
  } catch (error) {
    res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

module.exports.delCardById = async (req, res) => {
  try {
    const { CardId } = req.params;
    const owner = req.user._id;
    const card = await Card.findById(CardId).orFail(() => new Error('NotFoundError'));
    if (card.owner.toString() !== owner) {
      throw new Error('AccessError');
    }
    const deletedCard = await Card.findByIdAndDelete(CardId).onF;
    return res.status(OK).send({ deletedCard });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    if (error.message === 'AccessError') {
      return res.status(ACCESS_ERROR).send({ message: 'Нет прав для удаления карточки' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { CardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      CardId,
      { $addToSet: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));
    res.status(OK).send({ card });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { CardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      CardId,
      { $pull: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));
    res.status(OK).send({ card });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};
