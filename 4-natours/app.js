const express = require('express');
const fs = require('fs');

const app = express();

//middleware so we can add some data between the request and the response
app.use(express.json());

//to not have blocking code in the event loop we don't call the reading in the app.get callback function
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  //creating a JSend
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      //   tours: tours,
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  console.log('-------------------------------');
  // console.log(tours);

  //convert a string to a number trick
  const id = req.params.id * 1;

  // const tour = tours.find((el) => el.id === id);
  const tour = tours.find((el) => {
    return el.id === id;
  });

  // if (id > tours.length) {
  //sol 2
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
  // console.log(req.body);
  //creating a new object with a new id
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
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

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated trour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //204 no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//we should specify the version in case we need to update, so the old users to not be affected
// app.get(`/api/v1/tours`, getAllTours);

// app.post(`/api/v1/tours`, createTour);
//optional paramters ?
// app.get(`/api/v1/tours/:id/:x?/:y?`, (req, res) => {
// app.get(`/api/v1/tours/:id`, getTour);

// app.patch(`/api/v1/tours/:id`, updateTour);
//
// app.delete(`/api/v1/tours/:id`, deleteTour);

app.route(`/api/v1/tours`).get(getAllTours).post(createTour);
app
  .route(`/api/v1/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});

// ------------------------------------- With old code and comments

// const express = require('express');
// const fs = require('fs');

// const app = express();

// //middleware so we can add some data between the request and the response
// app.use(express.json());

// //we can use more simplified code with express, but under the hood it is still node code
// // app.get(`/`, (req, res) => {
// //   //   res.status(200).send('Hello from the server side!');
// //   res
// //     .status(200)
// //     .json({ message: 'Hello from the server side!', app: 'Natours' });
// // });

// // app.post('/', (req, res) => {
// //   res.send(`You can post to this endpoint`);
// // });

// //to not have blocking code in the event loop we don't call the reading in the app.get callback function
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
// //we should specify the version in case we need to update, so the old users to not be affected
// app.get(`/api/v1/tours`, (req, res) => {
//   //creating a JSend
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       //   tours: tours,
//       tours,
//     },
//   });
// });

// app.post(`/api/v1/tours`, (req, res) => {
//   // console.log(req.body);
//   //creating a new object with a new id
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );

//   // res.send('done');
// });
// //optional paramters ?
// // app.get(`/api/v1/tours/:id/:x?/:y?`, (req, res) => {
// app.get(`/api/v1/tours/:id`, (req, res) => {
//   console.log(req.params);
//   console.log('-------------------------------');
//   // console.log(tours);

//   //convert a string to a number trick
//   const id = req.params.id * 1;

//   // const tour = tours.find((el) => el.id === id);
//   const tour = tours.find((el) => {
//     return el.id === id;
//   });

//   // if (id > tours.length) {
//   //sol 2
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// app.patch(`/api/v1/tours/:id`, (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated trour here...>',
//     },
//   });
// });

// app.delete(`/api/v1/tours/:id`, (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   //204 no content
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// const port = 3000;
// app.listen(3000, () => {
//   console.log(`App running on port ${port}`);
// });
