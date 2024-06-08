const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const auth = require('../middleware/auth');

router.post('/signup', signupController);
router.post('/login', loginController);

// Redirect successful signup to login page
router.post('/signup', signupController, (req, res) => {
  res.redirect('/login/login.html');
});

// Redirect successful login to chat page
router.post('/login', loginController, (req, res) => {
  res.redirect('/chat/chat.html');
});

router.get('/someProtectedRoute', auth, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!' });
});

module.exports = router;




