document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);

  if (!user) {
    window.location.href = '/login/login.html';
    return;
  }

  const usersContainer = document.getElementById('users-container');
  const messageContainer = document.getElementById('message-container');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  // Keep track of joined users
  let joinedUsers = [];

  function displayUserList(users) {
    usersContainer.innerHTML = '';
    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.textContent = `${user.name} : joined`;
      usersContainer.appendChild(userElement);
    });
  }

  function displayMessage(messageData, isCurrentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${messageData.user.name}: ${messageData.message}`;
    if (isCurrentUser) {
      messageElement.classList.add('current-user');
    } else {
      messageElement.classList.add('other-user');
    }
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  function fetchMessages() {
    $.ajax({
      url: '/messages/all',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      success: function (messages) {
        messages.forEach(message => {
          // Check if message.user is defined before accessing its properties
          if (message.user && message.user.id) {
            displayMessage(message, message.user.id === user.id);
          }
        });
      },
      error: function (err) {
        console.error('Error fetching messages:', err);
      }
    });
  }

  // Call fetchMessages function when the page is loaded or refreshed
  fetchMessages();

  // Establish socket connection
  const socket = io();

  // Emit new user event upon connection
  socket.emit('newUser', user);

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() === '') return;

    const messageData = { user, message };

    socket.emit('sendMessage', messageData);
    displayMessage(messageData, true);
    messageInput.value = '';
  });

  socket.on('updateUserList', (users) => {
    displayUserList(users);
  });

  socket.on('newMessage', (data) => {
    // Check if data.user is defined before accessing its properties
    if (data.user && data.user.id !== user.id) {
      displayMessage(data, false);
    }
  });

  socket.on('userJoined', (user) => {
    // Check if the user has already joined
    if (!joinedUsers.includes(user.id)) {
      // Add the user to the list of joined users
      joinedUsers.push(user.id);
      // Display the "user joined" message
      const joinMessage = `${user.name} : joined`;
      const joinElement = document.createElement('div');
      joinElement.classList.add('join-message');
      joinElement.textContent = joinMessage;
      messageContainer.appendChild(joinElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  });
});







  




