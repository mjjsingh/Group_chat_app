require('dotenv').config();

const express = require('express');
const cors = require('cors');
const signupController = require('./controllers/signupController');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // to serve static files

app.post('/user/signup', signupController);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


