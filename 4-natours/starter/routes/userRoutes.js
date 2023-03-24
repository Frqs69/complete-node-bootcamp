const express = require('express');
const userController = require('../controllers/userController');

// specify new middleware for routes
const router = express.Router();

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