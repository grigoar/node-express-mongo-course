const express = require('express');
const fs = require('fs');

const app = express();

//we can use more simplified code with express, but under the hood it is still node code
// app.get(`/`, (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send(`You can post to this endpoint`);
// });

//to not have blocking code in the event loop we don't call the reading in the app.get callback function
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//we should specify the version in case we need to update, so the old users to not be affected
app.get(`/api/v1/tours`, (req, res) => {
  //creating a JSend
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      //   tours: tours,
      tours,
    },
  });
});

const port = 3000;
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
