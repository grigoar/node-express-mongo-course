const Tour = require('../models/tourModel');

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

exports.getAllTours = async (req, res) => {
  try {
    //BUILD THE QUERY
    //1A)  FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log(req.query, queryObj);

    //1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    //regular expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log('replace with $');
    console.log(JSON.parse(queryStr));

    //Tour.find return a query
    let query = Tour.find(JSON.parse(queryStr));

    //2)SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
      // query = query.sort(req.query.sort);
      // sort("price ratingsAverage")
    } else {
      query = query.sort('-createAt');
    }

    //3)FIELDS LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      //projecting
      // query = query.select(`name duration price`)
      query = query.select(fields);
    } else {
      //we can remove a field
      query = query.select('-__v');
    }

    // 4) PAGINATION

    //transforming a string to number
    //defaulting to 1
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //?page=2&limit=10, 1-10, 11-20, 21-30
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      //return a promise with the number of the documents
      const numTours = await Tour.countDocuments();
      console.log('There are no results for the requested page');
      if (skip >= numTours) throw new Error('This page does not exist!');
    }

    //EXECUTE THE QUERY
    // {difficulty: "easy", duration: {$gte:5}}
    // { difficulty: 'easy', duration: { gte: '5' } }

    // const tours = await Tour.find(queryObj);

    // const tours = await Tour.find({
    //   // duration: { $gt: 5 },
    //   duration: 5 ,
    //   difficulty: 'easy',
    // });
    // const tours = await Tour.find();
    // console.log(req.requestTime);

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //EXECUTE THE QUERY
    const tours = await query;
    //instead of chaining all here, we can construct the query one operation after another
    //query.sort().select().skip().limit();

    //SEND RESPONSE
    //creating a JSend
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //we can specify the raw query to the database in case we need to custom the search
    //filter
    //Tour.findOne({_id:req.params.id},)

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
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
};
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
    //in the async functions we need to use try catch, and if some error is throw by the await function it will enter the catch
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    //204 no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail to delete',
      message: err,
    });
  }
};

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
