const router = require('express').Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { createUser, login, logOut } = require('../controllers/users');
const { handleUnexistedPath } = require('../utils/handleUnexistedPath');

router.post('/signup', createUser);

router.post('/signin', login);

router.use('/users', usersRoutes);

router.use('/movies', moviesRoutes);

router.get('/signout', logOut);

router.use('/*', handleUnexistedPath);

module.exports = router;
