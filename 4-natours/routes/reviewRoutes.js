const express = require('express');

const routerController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//merge Params allow us to use the params from other routes also
const router = express.Router({ mergeParams: true });

//--------------NESTED Routes
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews

router
  .route('/')
  .get(routerController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    routerController.createReview
  );

//My implementation
// router.route('/tour/:tourId').get(routerController.getTourReviews);

module.exports = router;
