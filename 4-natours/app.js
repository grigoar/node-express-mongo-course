const express = require('express');

const app = express();

//we can use more simplified code with express, but under the hood it is still node code
app.get(`/`, (req, res) => {
  //   res.status(200).send('Hello from the server side!');
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send(`You can post to this endpoint`);
});

const port = 3000;
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
