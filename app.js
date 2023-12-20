const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');


mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,

});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '657af9244e73dbe41131c159',
  };
  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.listen(3000);