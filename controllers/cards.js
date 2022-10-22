const Card = require('../models/card');
const {
  Error400, Error404, Error500,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(Error500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Error400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(Error500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(Error404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: `Card id ${cardId} is not correct` });
      } else {
        res.status(Error500).send({ message: 'Error has occured' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('IncorrectCardID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.message === 'IncorrectCardID') {
        res.status(Error404).send({ message: 'Адрес указан некорректно.' });
      } else {
        res.status(Error500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('IncorrectCardID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.message === 'IncorrectCardID') {
        res.status(Error404).send({ message: 'Адрес указан некорректно.' });
      } else {
        res.status(Error500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
