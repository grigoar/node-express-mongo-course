const mongoose = require('mongoose');
//specify the default Schema and doing some validation and options
//schema options are different
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

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

//Testing
//
// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 933,
//   });

//   testTour
//     .save()
//     .then((doc) => {
//       console.log(doc);
//     })
//     .catch((err) => {
//       console.log('Error 💥💥: ', err);
//     });
