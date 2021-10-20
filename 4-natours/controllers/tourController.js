const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//when there is a mix of upload with different model properties use this
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  console.log(req.files);

  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  // const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  // .toFile(`public/img/tours/${imageCoverFilename}`);
  //we need to put the images on the req.body so the update tour gets all the body
  // req.body.imageCover = imageCoverFilename;
  //2) Images
  req.body.images = [];
  // req.files.images.forEach(async (file, i) => {
  //we need to use this so we wait until all the promises are returned and settled because if not the next() will call before the promises are resolved
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});

//when it is a single image to upload
// upload.singe('image');//req.file
//when there are multiple images to upload
// upload.array('images');req.files

//to not have blocking code in the event loop we don't call the reading in the app.get callback function
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkBody = (req, res, next) => {
//   //   console.log(req);
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'Fail',
//       message: 'Bad request, missing name or prices',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  //prefill the query object with fields so user can access it directly
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // //BUILD THE QUERY
//   // //1A)  FILTERING
//   // const queryObj = { ...req.query };
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   // excludedFields.forEach((el) => delete queryObj[el]);

//   // console.log(req.query, queryObj);

//   // //1B) ADVANCED FILTERING
//   // let queryStr = JSON.stringify(queryObj);
//   // //regular expression
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // console.log('replace with $');
//   // console.log(JSON.parse(queryStr));

//   // //Tour.find return a query
//   // let query = Tour.find(JSON.parse(queryStr));

//   //2)SORTING
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   console.log(sortBy);
//   //   query = query.sort(sortBy);
//   //   // query = query.sort(req.query.sort);
//   //   // sort("price ratingsAverage")
//   // } else {
//   //   query = query.sort('-createAt');
//   // }

//   //3)FIELDS LIMITING
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   //projecting
//   //   // query = query.select(`name duration price`)
//   //   query = query.select(fields);
//   // } else {
//   //   //we can remove a field
//   //   query = query.select('-__v');
//   // }

//   // 4) PAGINATION

//   //transforming a string to number
//   //defaulting to 1
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // //?page=2&limit=10, 1-10, 11-20, 21-30
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   //return a promise with the number of the documents
//   //   const numTours = await Tour.countDocuments();
//   //   console.log('There are no results for the requested page');
//   //   if (skip >= numTours) throw new Error('This page does not exist!');
//   // }

//   //EXECUTE THE QUERY
//   // {difficulty: "easy", duration: {$gte:5}}
//   // { difficulty: 'easy', duration: { gte: '5' } }

//   // const tours = await Tour.find(queryObj);

//   // const tours = await Tour.find({
//   //   // duration: { $gt: 5 },
//   //   duration: 5 ,
//   //   difficulty: 'easy',
//   // });
//   // const tours = await Tour.find();
//   // console.log(req.requestTime);

//   // const tours = await Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');

//   //EXECUTE THE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   //instead of chaining all here, we can construct the query one operation after another
//   //query.sort().select().skip().limit();

//   //SEND RESPONSE
//   //creating a JSend
//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// exports.getTour = catchAsync(async (req, res, next) => {
//   // const tour = await Tour.findById(req.params.id);
//   //fill up with the corresponding data we need to use populate function
//   // const tour = await Tour.findById(req.params.id).populate('guides');
//   // const tour = await Tour.findById(req.params.id).populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt',
//   // });
//   //we used middleware for the populate
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.getTour2 = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id);
//   //we can specify the raw query to the database in case we need to custom the search
//   //filter
//   //Tour.findOne({_id:req.params.id},)

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });

// console.log(req.params);
// console.log('-------------------------------');
// console.log(tours);

//convert a string to a number trick
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// const tour = tours.find((el) => el.id === id);

// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });
// });

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// try {
//   // const newTour = new Tour({});
//   // newTour.save();

//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
//   //in the async functions we need to use try catch, and if some error is throw by the await function it will enter the catch
// } catch (err) {
//   const error = {...err};

//   res.status(500).json({error});
// }
// });

exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   //204 no content

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

//aggregation pipeline is like a mongo query, but we can manipulate the data
exports.getTourStats = catchAsync(async (req, res, next) => {
  //stages
  //match, group
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        //group by one of the fields(id:null is for all)-very powerful
        // _id: null,
        // _id: '$difficulty',
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },

        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021

  const plan = await Tour.aggregate([
    //split the object based on an array. So we have as many objects as the array we define here
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        //to not show
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    // $limit: 12,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

//   '/tours-within/:distance/center/:latlng/unit/:unit',
//   '/tours-within/:distance/center/46.754118,23.5613089/unit/:unit',
//   '/tours-within/:distance/center/34.011665, -118.258723/unit/:unit',
///tours-distance?distance=223&center=40&45&unit=mi
exports.getsToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  //this is the radius of the earth... so we need to calculate for miles or for km unit
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.'
      ),
      400
    );
  }

  // console.log(distance, lat, lng, unit);
  //using geospatial operator from mongoDB
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  //this is the radius of the earth... so we need to calculate for miles or for km unit
  const multiplier = unit === 'mi' ? 0.000621371 : 0.0001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.'
      ),
      400
    );
  }
  const distanceFieldUnit = `distance_${unit}`;
  const distances = await Tour.aggregate([
    {
      //this needs to be in the first stage of aggregate
      //if we have more indexes we need to specify the index, but we only have index for the start location and it will use that
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

//------------------------------OLD code
// const fs = require('fs');
// const Tour = require('../models/tourModel');

// //to not have blocking code in the event loop we don't call the reading in the app.get callback function
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// // );

// //verify if the id is correct  or if not, to exit before the rest of the handlers are run
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   //   console.log(req);
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'Fail',
//       message: 'Bad request, missing name or prices',
//     });
//   }
//   next();
// };

// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   //creating a JSend
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       //   tours: tours,
//       tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   console.log(req.params);
//   console.log('-------------------------------');
//   // console.log(tours);

//   //convert a string to a number trick
//   const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);
//   const tour = tours.find((el) => el.id === id);

//   // if (id > tours.length) {
//   //sol 2
//   //   if (!tour) {
//   //     return res.status(404).json({
//   //       status: 'fail',
//   //       message: 'Invalid ID',
//   //     });
//   //   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };
// exports.createTour = (req, res) => {
//   // console.log(req.body);
//   //creating a new object with a new id
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, ...req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated trour here...>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   //204 no content
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
