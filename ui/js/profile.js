const {
  email, lastname, address, workaddress, status,
} = JSON.parse(localStorage.getItem('quick-credit-access-data'));
const usernameContainer = document.getElementById('username-container');
const userdataContainer = document.getElementById('userdata-container');
const myLoanApplicationsTable = document.getElementById('my-loan-applications-table');
const myLoansTable = document.getElementById('my-loans-table');
const loanApplicationsFeedbackDiv = document.getElementById('loan-applications-feedback');
const loansFeedbackDiv = document.getElementById('loans-feedback');

// Render the user's name, email, addresses and verification status stored in localStorage
const renderUserDetails = () => {
  const usernameHtml = `<p><strong>${firstname} ${lastname}</strong></p>
                            <p>${email}</p>`;
  let statusHtml = '';
  if (status === 'verified') {
    statusHtml = '<p class="profile-value display-text">Verified <span class="verified"><i class="fas fa-check"></i></span></p>';
  } else if (status === 'unverified') {
    statusHtml = '<p class="profile-value display-text">Unverified <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></p>';
  }
  const userdataHtml = `<div class="profile-unit">
                              <p class="profile-key display-text"><span><i class="fas fa-home"></i></span> Residential Address</p>
                              <p class="profile-value display-text">${address}</p>
                            </div>
                            <div class="profile-unit">
                              <p class="profile-key display-text"><span><i class="fas fa-city"></i></span> Office Address</p>
                              <p class="profile-value display-text">${workaddress}</p>
                            </div>
                            <div class="profile-unit">
                              <p class="profile-key display-text"><span><i class="fas fa-user"></i></span> Verification Status</p>
                              ${statusHtml}
                            </div>`;

  usernameContainer.insertAdjacentHTML('beforeend', usernameHtml);
  userdataContainer.innerHTML = userdataHtml;
};

// Render the head section of the modal display
const renderDisplayHeader = ({ client }, modalHeaderId) => {
  const modalUsernameContainer = document.getElementById(modalHeaderId);
  const userdataHtml = `<img class="avatar" src="./images/avatar.png" alt="Avatar">
                        <p><strong>${firstname} ${lastname}</strong></p>
                        <p>${client}</p>`;
  modalUsernameContainer.innerHTML = userdataHtml;
};

// Render the first column of the loan application modal
const renderLoanApplicationFirstColumn = ({
  createdon, amount, tenor, status: loanStatus,
}) => {
  let statusHtml = '';
  if (loanStatus === 'approved') {
    statusHtml = '<p class="value display-text">Approved <span class="verified"><i class="fas fa-check"></i></span></p>';
  } else if (loanStatus === 'pending') {
    statusHtml = '<p class="value display-text">Pending <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></p>';
  } else if (loanStatus === 'rejected') {
    statusHtml = '<p class="value display-text">Rejected <span class="rejected"><i class="fas fa-times"></i></span></p>';
  }
  const firstColumn = document.getElementById('loan-application-first-column');
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
                            <p class="key display-text">Status</p>
                            ${statusHtml}
                           </div>`;
  firstColumn.innerHTML = firstColumnHtml;
};


// Render the second column of the loan application modal
const renderLoanApplicationSecondColumn = ({ purpose, interest, paymentinstallment }) => {
  const secondColumn = document.getElementById('loan-application-second-column');
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
                            </div>`;
  secondColumn.innerHTML = secondColumnHtml;
};

// Render the entire content of the loan application modal
const renderLoanApplicationModalContent = (loan) => {
  renderDisplayHeader(loan, 'loan-application-username-container');
  renderLoanApplicationFirstColumn(loan);
  renderLoanApplicationSecondColumn(loan);
};

// Set the View button click event listeners of the loan application entries
const setupLoanApplicationsView = (loans) => {
  const loanIds = loans.map(loan => loan.id);
  const setupLoanApplicationModalContent = (loanId) => {
    const myLoan = loans.filter(loan => loan.id === loanId)[0];
    renderLoanApplicationModalContent(myLoan);
  };
  displayModal(
    'loan-application-modal',
    'loan-application-cancel-btn',
    'loan-application-close-btn',
    'open-loan-application-modal',
    loanIds,
    setupLoanApplicationModalContent,
  );
};

// Render the user's loan applications in the table
const renderLoanApplications = (data) => {
  data.forEach(({
    id, client, createdon, amount, status: loanStatus,
  }) => {
    let statusHtml = '';
    if (loanStatus === 'approved') {
      statusHtml = '<td class="loan-applications-table-unit">Approved <span class="verified"><i class="fas fa-check"></i></span></td>';
    } else if (loanStatus === 'pending') {
      statusHtml = '<td class="loan-applications-table-unit">Pending <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></td>';
    } else if (loanStatus === 'rejected') {
      statusHtml = '<td class="loan-applications-table-unit">Rejected <span class="rejected"><i class="fas fa-times"></i></span></td>';
    }
    const loanApplicationHtml = `<tr>
                                    <td class="loan-applications-table-unit">${firstname} ${lastname}</td>
                                    <td class="loan-applications-table-unit">${client}</td>
                                    <td class="loan-applications-table-unit">${new Date(createdon).toDateString()}, ${new Date(createdon).toLocaleTimeString()}</td>
                                    <td class="loan-applications-table-unit">N${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    ${statusHtml}
                                    <td class="loan-applications-table-unit"><button class="table-button" id="open-loan-application-modal-${id}"><span><i class="fas fa-eye"></i></span> View</button></td>
                                </tr>`;
    myLoanApplicationsTable.insertAdjacentHTML('beforeend', loanApplicationHtml);
  });
  setupLoanApplicationsView(data);
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
  renderDisplayHeader(loan, 'loan-username-container');
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

// Render the user's loans in the table
const renderLoans = (data) => {
  const loans = data.filter(loan => loan.status === 'approved');
  if (loans.length < 1) {
    loansFeedbackDiv.innerHTML = '<p>You have no active loans yet</p>';
  }
  loans.forEach(({
    id, client, createdon, amount, balance,
  }) => {
    const loanHtml = `<tr>
                        <td class="loans-table-unit">${firstname} ${lastname}</td>
                        <td class="loans-table-unit">${client}</td>
                        <td class="loans-table-unit">${new Date(createdon).toDateString()}, ${new Date(createdon).toLocaleTimeString()}</td>
                        <td class="loans-table-unit">N${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="loans-table-unit">N${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="loans-table-unit"><button class="table-button" id="open-loan-modal-${id}"><span><i class="fas fa-eye"></i></span> View</button></td>
                    </tr>`;
    myLoansTable.insertAdjacentHTML('beforeend', loanHtml);
  });
  setupLoansView(loans);
};

// Render all the dynamic information on the Profile page
renderUserDetails();
loanApplicationsFeedbackDiv.innerHTML = '<p class="unverified">Loading your loan applications...</p>';
loansFeedbackDiv.innerHTML = '<p class="unverified">Loading your loans...</p>';
apiGetFetch('/users/me/loans')
  .then((data) => {
    if (data.status === 200) {
      loanApplicationsFeedbackDiv.innerHTML = '';
      loansFeedbackDiv.innerHTML = '';
      if (data.data.length < 1) {
        loanApplicationsFeedbackDiv.innerHTML = '<p>You have not made any loan applications yet</p>';
      }
      data.data.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
      renderLoanApplications(data.data);
      renderLoans(data.data);
    } else if (data.status === 401) {
      location.assign('./login.html');
    } else {
      loanApplicationsFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
      loansFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  })
  .catch((err) => {
    loanApplicationsFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
    loansFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
  });
