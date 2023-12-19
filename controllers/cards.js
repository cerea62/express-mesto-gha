const Card = require('../models/card');

module.exports.createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    res.status(200).send({
      name: card.name,
      link: card.link,
      owner: card.owner,
    });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.status(200).send({ card });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.delCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const owner = req.user._id;
    const card = await Card.findByIdAndDelete(cardId);
    res.status(200).send({ card });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );
    if (!card) {
      console.log("Карточка не найдена");
    }
    res.status(200).send({ card });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );
    if (!card) {
      console.log("Карточка не найдена");
    }
    res.status(200).send({ card });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
