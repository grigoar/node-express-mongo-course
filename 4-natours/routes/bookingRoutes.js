const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

//merge Params allow us to use the params from other routes also
const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
