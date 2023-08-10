const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getUserInfo, updateUserInfoById } = require('../controllers/users');
const joiUpdateUserSchema = require('../joiSchemas/joiUpdateUserSchema');

router.get('/me', getUserInfo);

router.patch('/me', celebrate(joiUpdateUserSchema), updateUserInfoById);

module.exports = router;
