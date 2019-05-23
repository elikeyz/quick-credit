const adminLoginBtn = document.getElementById('admin-login-btn');

adminLoginBtn.addEventListener('click', (event) => {
  event.preventDefault();
  feedbackDiv.innerHTML = '<p class="unverified">Verifying your credentials</p>';
  login().then((data) => {
    if (data.status === 200 && data.data.isadmin) {
      feedbackDiv.innerHTML = '<p class="verified">Credentials verified</p>';
      localStorage.setItem('quick-credit-access-data', JSON.stringify(data.data));
      location = './clients.html';
    } else if (data.status === 200) {
      feedbackDiv.innerHTML = '<p class="rejected">You are not authorized to enter the Client Interface</p>';
    } else {
      feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  });
});
