const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const regExp = require('../regexp/regexp');

router.get('/users', getAllUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExp),
  }),
}), updateAvatar);

module.exports = router;
