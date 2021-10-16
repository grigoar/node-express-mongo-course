const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg(/(["'])(?:\\.|[^\\])*?\1/)[0];
  // console.log(value);

  // const message = `Duplicate field value: ${value}. Please use another value!`;
  const message = `Duplicate name field value. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  //this is without the root
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //RENDERED WEBSITE
  console.log('ERROR 💥💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

//This is not working fully so it might need a little more work to do
//something is happening when we copy the error from send error
const sendErrorProd = (err, req, res) => {
  //A. API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: send message to client
    //we set this field when we created the error
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
      // Programmming or other unknown error: don't leak error details
    }
    //1) Log error
    console.log('ERROR 💥💥', err);

    //2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later',
    });
  }
  //B. RENDERED Website
  //Operational, trusted error: send message to client
  //we set this field when we created the error
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    // Programmming or other unknown error: don't leak error details
  }
  //1) Log error
  console.log('ERROR 💥💥', err);

  //2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

const handleJWTError = (err) =>
  new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired! Please log in again', 401);

//this don't work fully in production because the copy is not fully populated
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let error = { ...err };
    error.message = err.message;
    //     error.name = err._proto.name;
    error.name = err.name || err.stack.split(':')[0];
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};

// module.exports = (err, req, res, next) => {
//   //to show the error stack problem in console
//   //   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err };
//     //we can mark the error  as operational using our AppError
//     if (error.name === 'CastError') error = handleCastErrorDB(error);

//     sendErrorProd(error, res);
//   }

//   //   res.status(err.statusCode).json({
//   //     status: err.status,
//   //     message: err.message,
//   //   });
// };
