
  document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login/login.html';
      return;
    }
    const user = JSON.parse(storedUser);
  
    socket.emit('newUser', user);
  
    const usersContainer = document.getElementById('users-container');
    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
  
    function displayUserList(users) {
      usersContainer.innerHTML = '';
      users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.textContent = `${user.name} : joined`;
        usersContainer.appendChild(userElement);
      });
    }
  
    function displayMessage(message, isCurrentUser) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.textContent = `${message.user.name}: ${message.message}`;
      if (isCurrentUser) {
        messageElement.classList.add('current-user');
      } else {
        messageElement.classList.add('other-user');
      }
      messageContainer.appendChild(messageElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      if (message.trim() === '') return;
      const messageData = { user, message };
      socket.emit('sendMessage', messageData);
      displayMessage(messageData, true); // Show the message once immediately for the sender
      messageInput.value = '';
    });
  
    socket.on('updateUserList', (users) => {
      displayUserList(users);
    });
  
    socket.on('newMessage', (data) => {
      if (data.user.id !== user.id) { // Only display the message from others
        displayMessage(data, false);
      }
    });
  
    socket.on('userJoined', (user) => {
      const joinMessage = `${user.name} : joined`;
      const joinElement = document.createElement('div');
      joinElement.classList.add('join-message');
      joinElement.textContent = joinMessage;
      messageContainer.appendChild(joinElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });
  });
  




