const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//merge Params allow us to use the params from other routes also
const router = express.Router({ mergeParams: true });

//--------------NESTED Routes
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//My implementation
// router.route('/tour/:tourId').get(routerController.getTourReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
