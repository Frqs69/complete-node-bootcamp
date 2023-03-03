const dotenv = require('dotenv');

// environment variables - Express
// console.log(app.get('env'));

// environment variables - Node.js
// add variables from .env file using npm i dotenv
dotenv.config({ path: './config.env' });
// console.log(process.env);

const app = require('./app');

// create server on port 3000 --------------------------------
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
