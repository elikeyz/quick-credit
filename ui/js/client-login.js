const clientLoginBtn = document.getElementById('client-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const feedbackDiv = document.getElementById('feedback');

// Authenticate the client's login details
clientLoginBtn.addEventListener('click', (event) => {
  event.preventDefault();
  clientLoginBtn.setAttribute('disabled', true);
  adminLoginBtn.setAttribute('disabled', true);
  feedbackDiv.innerHTML = '<p class="unverified">Verifying your credentials...</p>';
  login().then((data) => {
    clientLoginBtn.removeAttribute('disabled');
    adminLoginBtn.removeAttribute('disabled');
    if (data.status === 200 && !data.data.isadmin) {
      feedbackDiv.innerHTML = '<p class="verified">Credentials verified</p>';
      localStorage.setItem('quick-credit-access-data', JSON.stringify(data.data));
      location.assign('./loan-repayments.html');
    } else if (data.status === 200) {
      feedbackDiv.innerHTML = '<p class="rejected">You are not authorized to enter the Client Interface</p>';
    } else {
      feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  }).catch((err) => {
    feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
    clientLoginBtn.removeAttribute('disabled');
    adminLoginBtn.removeAttribute('disabled');
  });
});
