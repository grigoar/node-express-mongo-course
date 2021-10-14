const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

//specify the default Schema and doing some validation and options
//schema options are different
const tourSchema = new mongoose.Schema(
  {
    //-------DATA VALIDATION

    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must have be above 1.0'],
      max: [5, 'Rating must have be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //-------CUSTOM VALIDATOR
      validate: {
        validator: function (val) {
          // this only points to current document on NEW document creation
          //it doesn't work if we use update or other queries
          return val < this.price; //100<200
        },
        message: 'Discount price should ({VALUE}) be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    //array of string
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //if we want to hide a field
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    //this is embeded field
    startLocation: {
      // GeoJSON to specify the location geolocation data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //lat - long
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,
    //referencing
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
  },
  {
    //options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//ordering : 1 asc, -1 desc
// tourSchema.index({ price: 1 });
//compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
//for geospatial
tourSchema.index({ startLocation: '2dsphere' });

//Virtual populate
//We do this in order to link the reviews to the tour when we call for one. We don't use a lot of api calls
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//------------------virtual properties
//when we need to access this for the current document we need normal function
//can't use in queries
tourSchema.virtual('durationWeeks').get(function () {
  return Math.round(this.duration / 7);
});

//-------------document middleware : runs before .save() and .create() If using something else will not be executed. ex .insertMany()
//the "this" keywords points to the document that is processed to be saved in the database
tourSchema.pre('save', function (next) {
  //how the document looks before it is saved to the database
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//this is embedding the data-> but we will use the referencing because it only works when creating and if any updates are made we need to update the embedded data also
// tourSchema.pre('save', async function (next) {
//   //the result is an array of promises
//   const guidesPromises = this.guides.map(async (id) => {
//     return await User.findById(id);
//   });
//   console.log('hello when creating new tour');
//   //need to resolve the promises
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// //the save is called hook. So we have a pre save hook
// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// //here we have access to the document after it was saved
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// ---------------------QUERY MIDDLEWARE
//if we want to not show a tour based on some match
// tourSchema.pre('find', function (next) {
//regular expression, any string that starts with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  // this.populate({
  //   path: 'reviews',
  // });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// -----------AGGREGATION MIDDLEWARE
//if $geoNear is the first operator in the pipeline then change the code
// tourSchema.pre('aggregate', function (next) {
//   //adding at the beginning for the array a new match stage
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

//Testing
//
// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 933,
//   });

//   testTour
//     .save()
//     .then((doc) => {
//       console.log(doc);
//     })
//     .catch((err) => {
//       console.log('Error 💥💥: ', err);
//     });
