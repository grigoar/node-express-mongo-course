const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

//setting this as a middleware
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  //when they are not specified in the request body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
//   // //Allow nested routes
//   // //when they are not specified in the request body
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'Success',
//     data: {
//       review: newReview,
//     },
//   });
// });
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

//My implementation
// exports.getTourReviews = catchAsync(async (req, res, next) => {
//   const tourReviews = await Review.find({ tour: { $eq: req.params.tourId } });

//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tourReviews,
//     },
//   });
// });
