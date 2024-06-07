const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const auth = require('../middleware/auth');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/someProtectedRoute', auth, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!' });
});

module.exports = router;



