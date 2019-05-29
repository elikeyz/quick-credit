const emailField = document.getElementById('email-login');
const passwordField = document.getElementById('password-login');

const login = () => fetch('https://elikeyz-quick-credit.herokuapp.com/api/v1/auth/signin', {
  method: 'post',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    email: emailField.value,
    password: passwordField.value,
  }),
}).then(response => response.json());
