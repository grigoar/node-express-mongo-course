const express = require('express');
const tourController = require('../controllers/tourController');
// const {getAllTours ..} = require('./../controllers/tourController');

const router = express.Router();
const userRouter = express.Router();

//Param middleware
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   next();
// });

// router.param('id', tourController.checkID);
// router.use("/tours", tourController.checkBody);
//our middleware

// router.use((req, res, next) => {
//     console.log('Hello from the middleware ⭐');
//     next();
//   });

// ---------------- Router

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route(`/`)
  .get(tourController.getAllTours)
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);
// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

//we should specify the version in case we need to update, so the old users to not be affected
// app.get(`/api/v1/tours`, getAllTours);

// app.post(`/api/v1/tours`, createTour);
//optional paramters ?
// app.get(`/api/v1/tours/:id/:x?/:y?`, (req, res) => {
// app.get(`/api/v1/tours/:id`, getTour);

// app.patch(`/api/v1/tours/:id`, updateTour);
//
// app.delete(`/api/v1/tours/:id`, deleteTour);
