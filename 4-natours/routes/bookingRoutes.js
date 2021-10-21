const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

//merge Params allow us to use the params from other routes also
const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:tourId',
  // authController.protect,
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
