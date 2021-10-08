const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//merge Params allow us to use the params from other routes also
const router = express.Router({ mergeParams: true });

//--------------NESTED Routes
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//My implementation
// router.route('/tour/:tourId').get(routerController.getTourReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
