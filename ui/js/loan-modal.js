const loansTable = document.getElementById('loans-table');
const feedbackDiv = document.getElementById('feedback');

// Render the head section of the modal display
const renderDisplayHeader = ({ firstname, lastname, client }) => {
  const modalUsernameContainer = document.getElementById('loan-username-container');
  const userdataHtml = `<img class="avatar" src="./images/avatar.png" alt="Avatar">
                          <p><strong>${firstname} ${lastname}</strong></p>
                          <p>${client}</p>`;
  modalUsernameContainer.innerHTML = userdataHtml;
};

// Render the first column of the loan modal
const renderLoanFirstColumn = ({
  createdon, amount, tenor, balance,
}) => {
  const firstColumn = document.getElementById('loan-first-column');
  const firstColumnHtml = `<div class="profile-unit">
                              <p class="key display-text">Application Date</p>
                              <p class="value display-text">${new Date(createdon).toDateString()}, ${new Date(createdon).toLocaleTimeString()}</p>
                             </div>
                             <div class="profile-unit">
                              <p class="key display-text">Amount</p>
                              <p class="value display-text">N${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                             </div>
                             <div class="profile-unit">
                              <p class="key display-text">Tenor</p>
                              <p class="value display-text">${tenor} months</p>
                             </div>
                             <div class="profile-unit">
                              <p class="key display-text">Balance</p>
                              <p class="value display-text">N${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                             </div>`;
  firstColumn.innerHTML = firstColumnHtml;
};

// Render the second column of the loan modal
const renderLoanSecondColumn = ({
  purpose, interest, paymentinstallment, updatedon, balance, amount,
}) => {
  const secondColumn = document.getElementById('loan-second-column');
  const lastRepaymentDate = balance < (amount + interest) ? `${new Date(updatedon).toDateString()}, ${new Date(updatedon).toLocaleTimeString()}` : '-';
  const secondColumnHtml = `<div class="profile-unit">
                                  <p class="key display-text">Reason for Loan Request</p>
                                  <p class="value display-text">${purpose}</p>
                              </div>
                              <div class="profile-unit">
                                  <p class="key display-text">Interest</p>
                                  <p class="value display-text">N${interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                              <div class="profile-unit">
                                  <p class="key display-text">Monthly payment</p>
                                  <p class="value display-text">N${paymentinstallment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                              <div class="profile-unit">
                                  <p class="key display-text">Last Repayment Date</p>
                                  <p class="value display-text">${lastRepaymentDate}</p>
                              </div>`;
  secondColumn.innerHTML = secondColumnHtml;
};

// Render the entire content of the loan modal
const renderLoanModalContent = (loan) => {
  renderDisplayHeader(loan);
  renderLoanFirstColumn(loan);
  renderLoanSecondColumn(loan);
};

// Set the View button click event listeners on the loan entries
const setupLoansView = (loans) => {
  const loanIds = loans.map(loan => loan.id);
  const setupLoanModalContent = (loanId) => {
    const myLoan = loans.filter(loan => loan.id === loanId)[0];
    renderLoanModalContent(myLoan);
  };
  displayModal(
    'loan-modal',
    'loan-cancel-btn',
    'loan-close-btn',
    'open-loan-modal',
    loanIds,
    setupLoanModalContent,
  );
};

// Render the fetched loans in the table
const renderLoans = (loans) => {
  loans.forEach(({
    firstname, lastname, client, createdon, amount, balance, id,
  }) => {
    const loanHtml = `<tr>
                        <td class="loans-table-unit">${firstname} ${lastname}</td>
                        <td class="loans-table-unit">${client}</td>
                        <td class="loans-table-unit">${new Date(createdon).toDateString()}, ${new Date(createdon).toLocaleTimeString()}</td>
                        <td class="loans-table-unit">N${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="loans-table-unit">N${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="loans-table-unit"><button class="table-button" id="open-loan-modal-${id}"><span><i class="fas fa-eye"></i></span> View</button></td>
                    </tr>`;
    loansTable.insertAdjacentHTML('beforeend', loanHtml);
  });
  setupLoansView(loans);
};

// Fetch for loans from the API to be rendered
const fetchLoans = (url, loadingMessage, emptyMessage) => {
  loansTable.innerHTML = '';
  feedbackDiv.innerHTML = `<p class="unverified">${loadingMessage}...</p>`;
  apiGetFetch(url)
    .then((data) => {
      if (data.status === 200) {
        feedbackDiv.innerHTML = '';
        if (data.data.length < 1) {
          feedbackDiv.innerHTML = `<p>${emptyMessage}</p>`;
        } else {
          data.data.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
          renderLoans(data.data);
        }
      } else if (data.status === 401) {
        location.assign('./login.html');
      } else {
        feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
      }
    })
    .catch((err) => {
      feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
    });
};

fetchLoans('/loans?status=approved', 'Loading Loans', 'There are no active loans presently');
