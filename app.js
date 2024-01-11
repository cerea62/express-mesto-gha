const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const NOT_FOUND = 404;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,

});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', ((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
}));
app.use(errorHandler);
app.listen(3000);
