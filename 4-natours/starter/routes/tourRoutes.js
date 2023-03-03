const express = require('express');
const tourController = require('../controllers/tourController');

// specify new middleware for routes
const router = express.Router();

// add middleware for checking validity of ID
router.param('id', tourController.checkID);

//tours routes
router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
