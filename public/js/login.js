const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect login values
  const nameOrEmail = document.querySelector('#name-email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (nameOrEmail && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/accounts/login', {
      method: 'POST',
      body: JSON.stringify({ nameOrEmail, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the dashboard
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
