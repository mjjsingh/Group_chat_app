const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('/user/login', {
      email,
      password
    });

    if (response.status === 200) {
      alert('Successfully logged in');
      // Redirect to the chat window page after successful login
      window.location.href = '/chat/chat.html'; // Change to your chat window page
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Invalid email or password');
    } else {
      console.error(error);
    }
  }
});

