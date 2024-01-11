const Card = require('../models/card');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const CREATED = 201;
const OK = 200;

module.exports.createCard = async (req, res, next) => {
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
      next(new ValidationError('Переданы некорректные данные'));
    }
  }
  //     return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  //   }
  //   return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  // }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.status(OK).send({ card });
  } catch (error) {
    next(error);
    // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

module.exports.delCardById = async (req, res, next) => {
  try {
    const { CardId } = req.params;
    const owner = req.user._id;
    const card = await Card.findById(CardId)
      .orFail(() => new NotFoundError('Карточка с указанным id не найдена'));
    if (card.owner.toString() !== owner) {
      throw new AccessError('Нет прав для удаления карточки');
    }
    const deletedCard = await Card.findByIdAndDelete(CardId);
    return res.status(OK).send({ deletedCard });
  } catch (error) {
    next(error);
  }
  //   if (error.message === 'NotFoundError') {
  //     return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
  //   }
  //   // if (error.message === 'AccessError') {
  //   //   return res.status(ACCESS_ERROR).send({ message: 'Нет прав для удаления карточки' });
  //   // }
  //   return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  //   next(error);
  // }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { CardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      CardId,
      { $addToSet: { likes: owner } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка с указанным id не найдена'));
    return res.status(OK).send({ card });
  } catch (error) {
    next(error);
    // if (error.message === 'NotFoundError') {
    //   return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    // }
    // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { CardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      CardId,
      { $pull: { likes: owner } },
      { new: true },
    ).orFail(() => new NotFoundError('Карточка с указанным id не найдена'));
    return res.status(OK).send({ card });
  } catch (error) {
    next(error);
    // if (error.message === 'NotFoundError') {
    //   return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    // }
    // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};
