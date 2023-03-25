const dotenv = require('dotenv');
const mongoose = require('mongoose');

// caught error outside express - exceptions
process.on('uncaughtException', (err) => {
  console.log('Unhandled exception. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// environment variables - Express
// console.log(app.get('env'));

// environment variables - Node.js
// add variables from .env file using npm i dotenv
dotenv.config({ path: './config.env' });
// console.log(process.env);

// ----------------- CONNECT TO DATABASE ----------------
//create connection link to database hosted on atlas
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//connect to mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection established'));

const app = require('./app');

// create server on port 3000 --------------------------------
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// caught error outside express - rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
