const express = require('express');
const userRouter = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

router.route('/').get(userRouter.getAllUsers).put(userRouter.createUser);
router.route('/:id').get(userRouter.updateUser).delete(userRouter.deleteUser);

module.exports = router;
