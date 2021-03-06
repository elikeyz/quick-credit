// Authenticate the admin's login details
adminLoginBtn.addEventListener('click', (event) => {
  event.preventDefault();
  clientLoginBtn.setAttribute('disabled', true);
  adminLoginBtn.setAttribute('disabled', true);
  feedbackDiv.innerHTML = '<p class="unverified">Verifying your credentials...</p>';
  login().then((data) => {
    clientLoginBtn.removeAttribute('disabled');
    adminLoginBtn.removeAttribute('disabled');
    if (data.status === 200 && data.data.isadmin) {
      feedbackDiv.innerHTML = '<p class="verified">Credentials verified</p>';
      localStorage.setItem('quick-credit-access-data', JSON.stringify(data.data));
      location.assign('./clients.html');
    } else if (data.status === 200) {
      feedbackDiv.innerHTML = '<p class="rejected">You are not authorized to enter the Admin Interface</p>';
    } else {
      feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  }).catch((err) => {
    feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
    clientLoginBtn.removeAttribute('disabled');
    adminLoginBtn.removeAttribute('disabled');
  });
});
