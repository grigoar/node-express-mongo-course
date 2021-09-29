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
    console.erro('ERROR 💥💥', err);

    //2) Send generic message
    res.status(500).json({
      status: 'Error!',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  //to show the error stack problem in console
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }

  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     message: err.message,
  //   });
};
