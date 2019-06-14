let currentLoanId = '';

// Populate the datalist with the emails of all the clients fetched from the server
const populateEmailDatalist = () => {
  const emailDatalist = document.getElementById('client-emails');
  apiGetFetch('/users')
    .then((data) => {
      if (data.status === 200) {
        data.data.forEach((client) => {
          emailDatalist.insertAdjacentHTML('beforeend', `<option value="${client.email}">`);
        });
      } else if (data.status === 401) {
        location.assign('/login.html');
      }
    });
};

/*
Display the info of the current loan of the client
whose email is inputted in the Client Email field
*/
const displayCurrentLoanInfo = () => {
  const emailFeedbackDiv = document.getElementById('client-email-feedback');
  const clientEmailField = document.getElementById('email');
  const clientNameField = document.getElementById('client-name');
  const loanBalanceField = document.getElementById('loan-balance');
  const monthlyInstallmentField = document.getElementById('monthly-installment');
  const paidAmountField = document.getElementById('amount');
  const submitBtn = document.getElementById('submit-btn');

  clientEmailField.addEventListener('blur', () => {
    const clientEmail = clientEmailField.value;
    if (clientEmail) {
      clientEmailField.setAttribute('disabled', true);
      emailFeedbackDiv.innerHTML = '<p class="unverified">Fetching Client Loan Information...</p>';
      apiGetFetch('/loans?status=approved&repaid=false')
        .then((data) => {
          clientEmailField.removeAttribute('disabled');
          if (data.status === 200) {
            const currentLoanMatch = data.data.filter(loan => loan.client === clientEmail);
            if (currentLoanMatch.length < 1) {
              emailFeedbackDiv.innerHTML = '<p>The specified client has no current loans</p>';
            } else {
              const [currentLoan] = currentLoanMatch;
              const {
                firstname, lastname, balance, paymentinstallment, id,
              } = currentLoan;
              currentLoanId = id;
              clientNameField.value = `${firstname} ${lastname}`;
              loanBalanceField.value = balance;
              monthlyInstallmentField.value = paymentinstallment;
              paidAmountField.removeAttribute('disabled');
              submitBtn.removeAttribute('disabled');
              emailFeedbackDiv.innerHTML = '';
            }
          } else if (data.status === 401) {
            location.assign('./login.html');
          } else {
            emailFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
          }
        })
        .catch((err) => {
          clientEmailField.removeAttribute('disabled');
          emailFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
        });
    } else {
      clientNameField.value = '';
      loanBalanceField.value = '';
      monthlyInstallmentField.value = '';
      paidAmountField.setAttribute('disabled', true);
      submitBtn.setAttribute('disabled', true);
    }
  });

  clientEmailField.addEventListener('focus', () => {
    emailFeedbackDiv.innerHTML = '';
  });
};

/*
Set a submit event on the loan repayment form to post a
repayment to the current loan of the inputted client
*/
const setupFormSubmission = () => {
  const loanRepaymentForm = document.getElementById('loan-repayment-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedbackDiv = document.getElementById('loan-repayment-form-feedback');
  const paidAmountField = document.getElementById('amount');

  loanRepaymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitBtn.setAttribute('disabled', true);
    formFeedbackDiv.innerHTML = '<p class="unverified">Posting Loan Repayment...</p>';
    apiFetch(`/loans/${currentLoanId}/repayments`, 'POST', { paidAmount: Number(paidAmountField.value) })
      .then((data) => {
        submitBtn.removeAttribute('disabled');
        if (data.status === 201) {
          formFeedbackDiv.innerHTML = '<p class="verified">Loan Repayment Posted Successfully</p>';
          location.reload();
        } else if (data.status === 401) {
          location.assign('./login.html');
        } else {
          formFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
        }
      })
      .catch((err) => {
        submitBtn.removeAttribute('disabled');
        formFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
      });
  });
};

const setupLoanRepaymentForm = () => {
  populateEmailDatalist();
  displayCurrentLoanInfo();
  setupFormSubmission();
};

displayModal('loan-repayment-form-modal', 'cancel-form-btn', 'close-form-btn', 'open-form-modal', [], setupLoanRepaymentForm);
