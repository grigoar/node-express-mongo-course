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

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    // console.log(req.requestTime);
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
      message: 'Invalid data sent!',
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
    res.status(200).json({
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
