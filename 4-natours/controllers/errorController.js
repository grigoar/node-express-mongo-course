const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  //we set this field when we created the error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programmming or other unknown error: don't leak error details
  } else {
    //1) Log error
    console.log('ERROR 💥💥', err);

    //2) Send generic message
    res.status(500).json({
      status: 'Error!',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let error = { ...err };
//     error.name = err._proto.name;
error.name= err.stack.split(":")[0];
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorProd(error, res);
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
