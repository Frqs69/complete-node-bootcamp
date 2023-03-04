const mongoose = require('mongoose');

// create simple schema tour model mongoose
//create schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
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
