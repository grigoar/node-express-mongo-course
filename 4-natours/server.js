const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

//environment variables
// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
// app.listen(port, () => {
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
