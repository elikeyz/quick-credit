const clientLoginBtn = document.getElementById('client-login-btn');
const feedbackDiv = document.getElementById('feedback');

clientLoginBtn.addEventListener('click', (event) => {
  event.preventDefault();
  feedbackDiv.innerHTML = '<p class="unverified">Verifying your credentials</p>';
  login().then((data) => {
    if (data.status === 200 && !data.data.isadmin) {
      feedbackDiv.innerHTML = '';
      localStorage.setItem('quick-credit-access-data', JSON.stringify(data.data));
      location = './loan-repayments.html';
    } else if (data.status === 200) {
      feedbackDiv.innerHTML = '<p class="rejected">You are not authorized to enter the Client Interface</p>';
    } else {
      feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  });
});
