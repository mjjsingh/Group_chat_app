// login.js
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('/login', { // Corrected URL
      email,
      password
    });

    if (response.status === 200) {
      alert('Successfully logged in');
      const { token, user, redirectTo } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Redirect to the specified page after successful login
      window.location.href = redirectTo;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Invalid email or password');
    } else {
      console.error(error);
    }
  }
});





