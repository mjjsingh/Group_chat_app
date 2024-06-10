require('dotenv').config(); 

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const Message = require('./models/Message');
const auth = require('./middleware/auth'); 

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/users', userRoutes); 
app.use('/messages', auth, messageRoutes); 

let users = [];

io.on('connection', async (socket) => {
  console.log('A user connected');

  // Check if the user is returning or a new connection
  const isReturningUser = users.some(user => user.socketId === socket.id);

  if (!isReturningUser) {
    // If it's a new connection, handle user joining
    socket.on('newUser', (user) => {
      users.push({ ...user, socketId: socket.id });
      io.emit('updateUserList', users);
      socket.broadcast.emit('userJoined', user);
    });
  }

  // Send initial data to the connected user
  socket.emit('loadInitialData', { users, messages: [] });
  // Handle new user connections
  socket.on('newUser', (user) => {
    // Check if the user already exists in the users list
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    if (existingUserIndex === -1) {
      users.push(user);
      io.emit('updateUserList', users);
      socket.broadcast.emit('userJoined', user);
    } else {
      // If user already exists, update their socket ID
      users[existingUserIndex].socketId = socket.id;
    }
  });

  socket.on('sendMessage', async (data) => {
    const { user, message } = data;

    if (!user) {
      console.error('Sender information is missing');
      return;
    }

    io.emit('newMessage', { user, message });

    try {
      await Message.create({
        sender: user.id, 
        recipient: null, 
        message,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
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
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully', user: newUser, redirectTo: '/login/login.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route handler
app.post('/login', async (req, res) => {
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

    res.status(200).json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name }, redirectTo: '/chat/chat.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});










