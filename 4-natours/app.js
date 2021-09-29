const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

// 1) MIDDLEWARES
console.log('--------------');
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middleware so we can add some data between the request and the response
app.use(express.json());

//build in middleware for static file we want to be accessed
app.use(express.static(`${__dirname}/public`));

//our middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware ⭐');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLERS

//middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//error handling
//for all the methods
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // //if we pass an argument to next then nodejs knows we have an error
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//node js error handling by having an middleware with 4 arguments
app.use(globalErrorHandler);

//4) START THE SERVER
///
module.exports = app;

// ------------------------------------- With old code and comments

// const express = require('express');
// const fs = require('fs');

// const app = express();

// //middleware so we can add some data between the request and the response
// app.use(express.json());

// //we can use more simplified code with express, but under the hood it is still node code
// // app.get(`/`, (req, res) => {
// //   //   res.status(200).send('Hello from the server side!');
// //   res
// //     .status(200)
// //     .json({ message: 'Hello from the server side!', app: 'Natours' });
// // });

// // app.post('/', (req, res) => {
// //   res.send(`You can post to this endpoint`);
// // });

// //to not have blocking code in the event loop we don't call the reading in the app.get callback function
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
// //we should specify the version in case we need to update, so the old users to not be affected
// app.get(`/api/v1/tours`, (req, res) => {
//   //creating a JSend
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       //   tours: tours,
//       tours,
//     },
//   });
// });

// app.post(`/api/v1/tours`, (req, res) => {
//   // console.log(req.body);
//   //creating a new object with a new id
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

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

//   // res.send('done');
// });
// //optional paramters ?
// // app.get(`/api/v1/tours/:id/:x?/:y?`, (req, res) => {
// app.get(`/api/v1/tours/:id`, (req, res) => {
//   console.log(req.params);
//   console.log('-------------------------------');
//   // console.log(tours);

//   //convert a string to a number trick
//   const id = req.params.id * 1;

//   // const tour = tours.find((el) => el.id === id);
//   const tour = tours.find((el) => {
//     return el.id === id;
//   });

//   // if (id > tours.length) {
//   //sol 2
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// app.patch(`/api/v1/tours/:id`, (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated trour here...>',
//     },
//   });
// });

// app.delete(`/api/v1/tours/:id`, (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   //204 no content
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// const port = 3000;
// app.listen(3000, () => {
//   console.log(`App running on port ${port}`);
// });
