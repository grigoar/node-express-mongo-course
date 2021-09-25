const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours ..} = require('./../controllers/tourController');

const router = express.Router();
const userRouter = express.Router();

// ---------------- Router

router
  .route(`/`)
  .get(tourController.getAllTours)
  .post(tourController.createTour);
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
