// const { request } = require('../app');
const Tour = require('./../models/tourModel');

// ---------- MIDLLEWARE Functions --------------------------------
exports.aliasTopTours = (req, res, next) =>{
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next()
}


// ---------- ROUTER HANDLER FUNCTIONS ----------------------------
exports.getAllTours = async (req, res) => {
  try {
    // ----------------- BUILD QUERY ------------------------------
    // 1A) Filtering
    // create hard copy of req.query object
    const queryObj = { ...req.query };
    // {} - create object
    // ... - destructure req.query to new object

    // create an array of all fields which we want to exclude from req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // delete all excluded fields from query object
    excludedFields.forEach((field) => delete queryObj[field]);

    // show how works excluding fields to console - ONLY FOR TESTING
    // console.log(req.query, queryObj);

    // 1B) Advanced filtering
    // change data to string
    let queryStr = JSON.stringify(queryObj);
    // search for gte|gt|lte|lt using regular expression
    // \b - match only given word
    // g - words can be multiple times
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // First way to query for specific data
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting data
    if (req.query.sort) {
      // take results from req.query.sort and split them and then join them with ' '
      const sortBy = req.query.sort.split(',').join(' ');
      // need to be separated by ' ' not ,
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting - limit field for given query
    if (req.query.fields) {
      // take results from req.query.fields and split them and then join them with ' '
      const fields = req.query.fields.split(',').join(' ');
      // need to be separated by ' ' not ,
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    // take page value from query or set default to 1
    const page = req.query.page * 1 || 1; // \* 1 to convert string to number
    // take limit value from query or set default to 10
    const limit = req.query.limit * 1 || 10; // \* 1 to convert string to number
    // calculate skip value
    const skip = (page - 1) * limit;

    if (req.query.page) {
      // return promise of number of documents
      const numTours = await Tour.countDocuments();
      // skip cant be greater than number of documents
      if (skip >= numTours) throw new Error('This page does note exists');
    }

    // page=2&limit=10, 1-10, next 11-20, next 21-30
    query = query.skip(skip).limit(limit);

    // Second way to query for specific data
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // ---------------------- EXECUTE QUERY ----------------------------
    const tours = await query;

    // ---------------------- SEND RESPONSE ----------------------------
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // new updated document will be returned
      runValidators: true, //check validation of data
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
