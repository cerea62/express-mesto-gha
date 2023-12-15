const routerCard = require('express').Router();

const { createCard, getCards, delCardById } = require('../controllers/cards');

routerCard.post('/', createCard);
routerCard.get('/', getCards);
routerCard.delete('/:cardId', delCardById);

module.exports = routerCard;