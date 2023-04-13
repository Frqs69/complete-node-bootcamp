const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again.', 401);

const sendErrorDev = (req, err, res) => {
  // API error - not working in req dont have originalUrl property
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  // } else {
  //   // RENDERED WEBSITE ERROR
  //   res.status(err.statusCode).render('error', {
  //     title: 'something went wrong',
  //     msg: err.message,
  //   });
  // }
};

const sendErrorProd = (err, req, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // create copy of err object
    let error = { ...err };

    //  error is when creating, updating or getting data from database which not exist
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // error of duplicate fields
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    //validation error
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // Json web token error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // Json web token expired
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
