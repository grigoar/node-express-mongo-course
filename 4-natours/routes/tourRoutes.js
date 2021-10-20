const express = require('express');
const tourController = require('../controllers/tourController');
// const {getAllTours ..} = require('./../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

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
//--------------NESTED Routes
//child resource to parent resources
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews
//GET /tour/3434543/reviews/3434223

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

//this is the same as the app.use, so when the request hit this then it will be decoupled and it will use the reviewRouter
//merge params for express to pass the tourId to reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getsToursWithin);
///tours-distance?distance=223&center=40&45&unit=mi
// /tours-distance/223/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route(`/`)
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
// .post(tourController.checkBody, tourController.createTour);
// app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

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
