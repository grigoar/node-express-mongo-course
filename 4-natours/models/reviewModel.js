//review//rating/createdAt/ref to tour/ ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { findByIdAndUpdate } = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'The review can not be empty'],
    },
    rating: {
      type: Number,
      required: [true, 'The review mush have a rating'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    //parent referencing
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user.'],
    },
  },
  {
    //options
    //when we have a field that is not stored in the database we still want to show the property in the response
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//we need a combination of user-tour to be unique so we don't have duplicated reviews on the same tour from one user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //Each populate added a new query for the MongoDB]
  //this might not be needed
  //   this.populate({
  //     path: 'tour',
  //     select: 'name ',
  //   });
  //selecting only necessary data
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//Statics mongoose functions
// Review.calcAverageRatings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  //persisting the average into the model with the values we calculated
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function (next) {
  //this points to current review
  //this points to the current document, because we don't have access yet to the model
  this.constructor.calcAverageRatings(this.tour);
  // Review.calcAverageRating(this.tour)
  // next();
});

//these have the query only
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this point to the query so we need to execute it and wait it
  // const r = await this.findOne();
  //trick so we use this.r so we are able to use it in the post model
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  // await this.findOne(); // does NOT work here, query has already executed
  //the model is on this.r.constructor and then we calculate the static method
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//--------------NESTED Routes
//child resource to parent resources
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews
//GET /tour/3434543/reviews/3434223
