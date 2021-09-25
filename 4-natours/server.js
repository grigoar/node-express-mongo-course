const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
//"scripts": {
// "start": "SET NODE_ENV=development & SET X=23 & nodemon server.js",

//environment variables
console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
// app.listen(port, () => {
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
