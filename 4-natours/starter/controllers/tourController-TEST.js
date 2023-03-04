// const fs = require('fs'); -- only for testing
const Tour = require('./../models/tourModel');

//read tours from file and convert to JSON - if not have database (for testing)
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// ---------- MIDLLEWARE Functions --------------------------------

// check if id is valid - no need ( for testing)
// exports.checkID = (req, res, next, val) => {
//check if tour exists
//   if (parseInt(req.params.id) > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }

  next();
};

// ---------- ROUTER HANDLER FUNCTIONS ----------------------------
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  //   console.log(req.params);

  //convert id to number
  const id = parseInt(req.params.id);

  //get tour with given id
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.addTour = (req, res) => {
  // console.log(req.body);

  // create next id for data
  const newID = tours[tours.length - 1].id + 1;

  // add new it to next data
  const newTour = Object.assign({ id: newID }, req.body);

  // add new data to tours array
  tours.push(newTour);

  //write data to tour file and stringify it
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour here..>' },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
