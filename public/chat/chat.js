document.addEventListener('DOMContentLoaded', () => {
  const messageContainer = document.getElementById('message-container');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  function displayMessage(message, isCurrentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;
    if (isCurrentUser) {
      messageElement.classList.add('current-user');
    } else {
      messageElement.classList.add('other-user');
    }
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  async function sendMessage() {
    const message = messageInput.value;
    if (message.trim() === '') return;
    try {
      const response = await axios.post('/message/send', { message });
      if (response.status === 201) {
        displayMessage(message, true);
        messageInput.value = '';
      }
    } catch (error) {
      console.error(error);
    }
  }

  sendButton.addEventListener('click', sendMessage);
});

