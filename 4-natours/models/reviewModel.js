//review//rating/createdAt/ref to tour/ ref to user
const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//--------------NESTED Routes
//child resource to parent resources
//POST /tour/3434543/reviews
//GET /tour/3434543/reviews
//GET /tour/3434543/reviews/3434223
