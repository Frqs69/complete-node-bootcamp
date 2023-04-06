const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// specify new middleware for routes
const router = express.Router();

// user route with authentication data

//route to signup and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// routes for password change
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// all routes under this middleware will be protected ( only logged user can access this routes)
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

//routes for changing user data
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// all routes under this middleware are protected (only admin can access this routes)
router.use(authController.restrictTo('admin'));

// users routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
