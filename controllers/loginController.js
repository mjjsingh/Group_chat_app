// loginController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    // Redirect to chat page after successful login
    res.status(200).json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name }, redirectTo: '/chat/chat.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


