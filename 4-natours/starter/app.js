const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const pug = require('pug');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// set template engine to pug (express supports it)
app.set('view engine', 'pug');
app.set('views', 'views');

// -------------- GLOBAL MIDDLEWARES -----------------------------

// serving static files in middleware
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

// Secure HTP headers using npm package helmet
app.use(helmet());

// if we are on dev mode use morgan
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  //third party middleware
  app.use(morgan('dev'));
}

// middleware, which count how many request was sent from IP to prevent hacker attack
// define how many request from IP can be sent in amount of time
// using it only for API
// for this purpose we use npm package express-rate-limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//middleware - between requests and responses
// body parser, reading data from body into req.body limited to 10kb
app.use(express.json({ limit: '10kb' }));

// prevent from malicious code
// Data sanitization against NoSQL query injection - npm package express-mongo-sanitize
app.use(mongoSanitize());

// Data sanitization against XSS (cross site scripting) - npm package xss-clean
app.use(xss());

// Prevent Parameter Pollution - npm package hpp
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

// create own middleware
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ------- ROUTES ----------------
// get method for tours api - show all data
// app.get('/api/v1/tours', getAllTours);

// get method for tours api with parameter - show all data by ID
// app.get('/api/v1/tours/:id', getTour);

// post method for tours api - add data
// app.post('/api/v1/tours', addTour);

// patch method for tours api - update existing properties in tours
// app.patch('/api/v1/tours/:id', updateTour);

// delete method for tours api - delete data
// app.delete('/api/v1/tours/:id', deleteTour);

// ------------- ROUTES better way ---------------------------

// mounting new router on a route
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//handle other routes which not exist - need to be last route
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

//create global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
