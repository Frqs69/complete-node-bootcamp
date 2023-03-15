const express = require('express');
const tourController = require('../controllers/tourController');

// specify new middleware for routes
const router = express.Router();

//tours routes

// route alias for top 5 cheap using middleware
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// route for stats from tours
router.route('/tours-stats').get(tourController.getTourStats);

// route for monthly plan
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(tourController.getAllTours).post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
