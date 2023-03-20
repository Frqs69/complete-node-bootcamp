const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// create simple schema tour model mongoose
//create schema ( first object for definition, second object for options)
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [5, 'A tour name must have more or equal then 5 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current document, not work when updating document
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, //Delete whitespace on beginning and end of string
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide created date from user
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true }, // need to be specified when we want to see durationWeeks in api
    toObject: { virtuals: true }, // need to be specified when we want to see durationWeeks in api
  }
);

// creating virtual properties
// technically this is not part of database, so we can't use it in query for Database
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// --------------------- mongoose middleware ------------------------
// DOCUMENT MIDDLEWARE - targeting current document
// pre middleware - before document will be save to database, runs before save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// post middleware - after document will be saved to database, after pre middleware functions
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE - targeting current query
// tourSchema.pre('find', function (next) {
//using regular expression to use this pre middleware for all find methods
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE - current aggregation object
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//create model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//testing tour
// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// })

// testTour.save().then(doc=>console.log(doc)).catch(err=>console.log(err));
