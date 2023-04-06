const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true }, // need to be specified when we want to see durationWeeks in api
    toObject: { virtuals: true }, // need to be specified when we want to see durationWeeks in api
  }
);

// prevent user to create multiple reviews on same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// populate data from users and tours
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static methods
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};

// calculate average rating after create new rating
reviewSchema.post('save', function () {
  //this points to current review
  // need to use constructor, not Review, because Review is created after save
  this.constructor.calcAverageRatings(this.tour);
});

// ------------ METHOD TO SEND DATA FROM PRE MIDDLEWARE TO POST MIDDLEWARE ---------

// calculate average rating before update or delete rating
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // save result from query in variable and assing it to current query
  // after that we can use this variable after data change in post middleware
  this.review = await this.findOne();
  next();
});

// after data update we can calc new average rating using saved variable
reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
