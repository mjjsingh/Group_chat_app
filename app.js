require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const User = require('./models/User');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newUser', (user) => {
    users.push({ id: socket.id, ...user });
    io.emit('updateUserList', users);
    socket.broadcast.emit('userJoined', user); // Emit userJoined event to all other users
  });

  socket.on('sendMessage', (data) => {
    io.emit('newMessage', data); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('updateUserList', users);
  });
});

// Signup route handler
app.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    // Redirect to the login page after successful signup
    res.status(201).json({ message: 'User created successfully', redirectTo: '/login/login.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route handler
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    // Redirect to the chat page after successful login
    res.status(200).json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name }, redirectTo: '/chat/chat.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






