const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('/user/signup', {
      name,
      email,
      phone,
      password
    });

    if (response.status === 201) {
      alert('Successfully signed up');
      window.location.href = '/login/login.html';
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert('User already exists, Please Login'); 
    } else {
      console.error(error);
    }
  }
});
