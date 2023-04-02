const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// -------------- MIDDLEWARES -----------------------------
// if we are on dev mode use morgan
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  //third party middleware
  app.use(morgan('dev'));
}

//middleware - between requests and responses
app.use(express.json());
// static files in middleware
app.use(express.static(`${__dirname}/public`));

// create own middleware
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers)
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
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

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
