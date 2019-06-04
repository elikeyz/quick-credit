const signupForm = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');
const feedbackDiv = document.getElementById('feedback');
const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const addressField = document.getElementById('home-address');
const workAddressField = document.getElementById('work-address');
const emailField = document.getElementById('email-signup');
const passwordField = document.getElementById('password-signup');
const confirmPasswordField = document.getElementById('confirm-password-signup');

const signup = () => fetch('https://elikeyz-quick-credit.herokuapp.com/api/v1/auth/signup', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    firstName: firstNameField.value,
    lastName: lastNameField.value,
    email: emailField.value,
    password: passwordField.value,
    address: addressField.value,
    workAddress: workAddressField.value,
  }),
})
  .then(response => response.json());

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  signupBtn.setAttribute('disabled', true);
  if (passwordField.value !== confirmPasswordField.value) {
    feedbackDiv.innerHTML = '<p class="rejected">Please confirm your password</p>';
    signupBtn.removeAttribute('disabled');
  } else {
    feedbackDiv.innerHTML = '<p class="unverified">Creating your account</p>';
    signup()
      .then((data) => {
        if (data.status === 201) {
          feedbackDiv.innerHTML = '<p class="verified">Your account has been created</p>';
          localStorage.setItem('quick-credit-access-data', JSON.stringify(data.data));
          location = './loan-repayments.html';
        } else {
          feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
          signupBtn.removeAttribute('disabled');
        }
      }).catch((err) => {
        feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
        signupBtn.removeAttribute('disabled');
      });
  }
});
