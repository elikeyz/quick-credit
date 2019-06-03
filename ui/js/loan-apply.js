const setupLoanApplicationForm = () => {
  const form = document.getElementById('loan-application-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedbackDiv = document.getElementById('loan-application-form-feedback');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitBtn.setAttribute('disabled', true);
    formFeedbackDiv.innerHTML = '<p class="unverified">Sending loan application...</p>';
    const requestBody = {
      amount: Number(document.getElementById('amount').value),
      purpose: document.getElementById('reason').value,
      tenor: parseInt(document.getElementById('tenor').value, 10),
    };
    apiFetch('/loans', 'post', requestBody)
      .then((data) => {
        submitBtn.removeAttribute('disabled');
        if (data.status === 201) {
          formFeedbackDiv.innerHTML = '<p class="verified">Loan application sent successfully</p>';
          location.reload();
        } else if (data.status === 401) {
          location.assign('./login.html');
        } else {
          formFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
        }
      })
      .catch((err) => {
        formFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
      });
  });
};

displayModal('loan-application-form-modal', 'cancel-btn', 'close-btn', 'open-modal', [], setupLoanApplicationForm);
