const router = require('express').Router();
const { celebrate } = require('celebrate');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { createUser, login, logOut } = require('../controllers/users');
const { handleUnexistedPath } = require('../utils/handleUnexistedPath');
const auth = require('../middlewares/auth');
const joiUserSchema = require('../joiSchemas/joiUserSchema');
const joiMainDataSchema = require('../joiSchemas/joiMainData');

router.post('/signup', celebrate(joiUserSchema), createUser);

router.post('/signin', celebrate(joiMainDataSchema), login);

router.use('/users', auth, usersRoutes);

router.use('/movies', auth, moviesRoutes);

router.get('/signout', auth, logOut);

router.use('/*', handleUnexistedPath);

module.exports = router;
