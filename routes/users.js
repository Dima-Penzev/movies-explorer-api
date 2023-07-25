const router = require('express').Router();
const { getUserInfo, updateUserInfoById } = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', updateUserInfoById);

module.exports = router;
