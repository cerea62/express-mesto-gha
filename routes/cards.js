const routerCard = require('express').Router();

const {
  createCard, getCards, delCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCard.post('/', createCard);
routerCard.get('/', getCards);
routerCard.delete('/:CardId', delCardById);
routerCard.put('/:CardId/likes', likeCard);
routerCard.delete('/:CardId/likes', dislikeCard);

module.exports = routerCard;
