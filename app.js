const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const Error404 = 404;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '634e9cbe291cfe45b1636da8',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  //  useCreateIndex: true,
  // useFindAndModify: false,
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(Error404).send({ message: 'Ресурс не найден.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
