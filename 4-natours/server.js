const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT REJECTION! 💥💥Shutting down...');
  process.exit(1);
  // server.close(() => {
  // });
});

dotenv.config({ path: './config.env' });
const app = require('./app');
//"scripts": {
// "start": "SET NODE_ENV=development & SET X=23 & nodemon server.js",

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

//this is how we connect to the database, and the result is a promise
//there are some options that we might need for deprecation
mongoose
  //for local database
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful!');
  });
// .catch((err) => console.log('ERROR'));

//environment variables
// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
// app.listen(port, () => {
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//--------------------------Handling the unhandle rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // console.log(err);
  console.log('UNHANDLED REJECTION! 💥💥Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
