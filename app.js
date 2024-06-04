require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const userRoute = require('./routes/userRoute');


const app = express();


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static('public'));

app.use('/user', userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
