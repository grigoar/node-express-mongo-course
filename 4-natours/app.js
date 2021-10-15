const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const path = require('path');
const express = require('express');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src  'self' api.mapbox.com",
//     "script-src-elem 'self' api.mapbox.com"
//   );
//   next();
// });

// app.use(
//   csp({
//     policies: {
//       'default-src': [csp.NONE],
//       'img-src': [csp.SELF],
//     },
//   })
// );

// app.use(
//   expressCspHeader({
//     directives: {
//       'default-src': [SELF],
//       'script-src': [SELF, INLINE, 'api.mapbox.com'],
//       'style-src': [SELF, 'api.mapbox.com'],
//       'img-src': ['data:', 'images.com'],
//       'worker-src': [NONE],
//       'block-all-mixed-content': true,
//     },
//   })
// );

//telling express what template engine we will use
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.set('views', "./views"));//it works locally, the path might not work on the server

// 1) GLOBAL MIDDLEWARES
//Server static files
//build in middleware for static file we want to be accessed
app.use(express.static(path.join(__dirname, `public`)));
// app.use(express.static(`${__dirname}/public`));

//Set security HTTP headers
app.use(helmet());

console.log('--------------');
console.log(process.env.NODE_ENV);
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
//maximum 100 requests in 1 hour for preventing brute force
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
//middleware so we can add some data between the request and the response
// app.use(express.json());
//accepts only a file of maximum size of 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Preventing parameter pollution
//whitelist some parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//our middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware ⭐');
//   next();
// });

//Testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(x);
  // console.log(req.headers);
  next();
});

// 2) ROUTE HANDLERS

// app.get('/', (req, res) => {
//   //it will now the path and it will search for the view file because we specified to render
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Grigoar',
//   });
// });

// //we can use this with extend base to change the content of the block we want when the route is changing
// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'All tours',
//   });
// });
// app.get('/tour', (req, res) => {
//   res.status(200).render('tour', {
//     title: 'The Forest Hiker',
//   });
// });
//for the mapbox

//middleware
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
