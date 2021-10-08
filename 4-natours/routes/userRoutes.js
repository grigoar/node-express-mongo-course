const express = require('express');
const userRouter = require('../controllers/userController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
//even if we don't actually delete the user use can fake it to look like it
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

router.route('/').get(userRouter.getAllUsers).put(userRouter.createUser);
router
  .route('/:id')
  .get(userRouter.getUser)
  .delete(userRouter.deleteUser)
  .patch(userRouter.updateUser);

module.exports = router;
