const express = require('express');
const userRouter = require('../controllers/userController');

const router = express.Router();

// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

router.route('/').get(userRouter.getAllUsers).put(userRouter.createUser);
router.route('/:id').get(userRouter.updateUser).delete(userRouter.deleteUser);

module.exports = router;
