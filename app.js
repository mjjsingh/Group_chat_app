require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/messages', messageRoutes);

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newUser', (user) => {
    users.push({ id: socket.id, ...user });
    io.emit('updateUserList', users);
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('updateUserList', users);
    console.log('A user disconnected');
  });

  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





