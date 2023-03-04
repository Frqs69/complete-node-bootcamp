const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
