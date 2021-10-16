const express = require('express');
const userRouter = require('../controllers/userController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//it runs in order so we can add a middleware
//Protects all routes after this middleware
router.use(authController.protect);

router.patch(
  '/updateMyPassword',

  authController.updatePassword
);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
//even if we don't actually delete the user use can fake it to look like it
router.delete('/deleteMe', userController.deleteMe);

// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

//from here the routes are also restricted to the admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userRouter.getAllUsers).put(userRouter.createUser);
router
  .route('/:id')
  .get(userRouter.getUser)
  .delete(userRouter.deleteUser)
  .patch(userRouter.updateUser);

module.exports = router;
