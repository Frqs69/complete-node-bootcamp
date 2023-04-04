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
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

//routes for changing user data
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

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
