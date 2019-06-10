const loanApplicationsTable = document.getElementById('loan-applications-table');
const feedbackDiv = document.getElementById('feedback');

const renderDisplayHeader = ({ firstname, lastname, client }) => {
  const loanApplicationUsernameContainer = document.getElementById('loan-application-username-container');
  const userdataHtml = `<img class="avatar" src="./images/avatar.png" alt="Avatar">
                        <p><strong>${firstname} ${lastname}</strong></p>
                        <p>${client}</p>`;
  loanApplicationUsernameContainer.innerHTML = userdataHtml;
};

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

const renderLoanApplicationBtns = ({
  status, balance, amount, interest,
}) => {
  const btnContainer = document.getElementById('loan-application-btn-container');
  let btnHtml = '';
  if (balance < (amount + interest)) {
    btnHtml = '<button class="application-button btn-two" id="loan-application-cancel-btn">Cancel</button>';
  } else if (status === 'approved') {
    btnHtml = `<button class="application-button reject-btn" id="reject-btn">Reject</button>
    <button class="application-button btn-two" id="loan-application-cancel-btn">Cancel</button>`;
  } else if (status === 'rejected') {
    btnHtml = `<button class="application-button accept-btn" id="accept-btn">Approve</button>
    <button class="application-button btn-two" id="loan-application-cancel-btn">Cancel</button>`;
  } else if (status === 'pending') {
    btnHtml = `<button class="application-button accept-btn" id="accept-btn">Approve</button>
            <button class="application-button reject-btn" id="reject-btn">Reject</button>
            <button class="application-button btn-two" id="loan-application-cancel-btn">Cancel</button>`;
  }
  btnContainer.innerHTML = btnHtml;
};

const setupApproveBtn = ({ id }) => {
  const approveBtn = document.getElementById('accept-btn');
  const modalFeedbackDiv = document.getElementById('modal-feedback');
  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      modalFeedbackDiv.innerHTML = '<p class="unverified">Approving Loan Application...</p>';
      apiFetch(`/loans/${id}`, 'PATCH', { status: 'approved' })
        .then((data) => {
          if (data.status === 200) {
            modalFeedbackDiv.innerHTML = '<p class="verified">Loan application has been approved successfully</p>';
            location.reload();
          } else if (data.status === 401) {
            location.assign('./login.html');
          } else {
            modalFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
          }
        })
        .catch((err) => {
          modalFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
        });
    });
  }
};

const setupRejectBtn = ({ id }) => {
  const rejectBtn = document.getElementById('reject-btn');
  const modalFeedbackDiv = document.getElementById('modal-feedback');
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      modalFeedbackDiv.innerHTML = '<p class="unverified">Rejecting loan application</p>';
      apiFetch(`/loans/${id}`, 'PATCH', { status: 'rejected' })
        .then((data) => {
          if (data.status === 200) {
            modalFeedbackDiv.innerHTML = '<p class="verified">Loan application has been rejected successfully</p>';
            location.reload();
          } else if (data.status === 401) {
            location.assign('./login.html');
          } else {
            modalFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
          }
        })
        .catch((err) => {
          modalFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
        });
    });
  }
};

const renderLoanApplicationModalContent = (loan) => {
  renderDisplayHeader(loan);
  renderLoanApplicationFirstColumn(loan);
  renderLoanApplicationSecondColumn(loan);
  renderLoanApplicationBtns(loan);
  setupApproveBtn(loan);
  setupRejectBtn(loan);
};

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

const renderLoanApplications = (loans) => {
  loans.forEach(({
    firstname, lastname, client, createdon, amount, status, id,
  }) => {
    let statusHtml = '';
    if (status === 'approved') {
      statusHtml = '<td class="loan-applications-table-unit">Approved <span class="verified"><i class="fas fa-check"></i></span></td>';
    } else if (status === 'pending') {
      statusHtml = '<td class="loan-applications-table-unit">Pending <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></td>';
    } else if (status === 'rejected') {
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
    loanApplicationsTable.insertAdjacentHTML('beforeend', loanApplicationHtml);
  });
  setupLoanApplicationsView(loans);
};

feedbackDiv.innerHTML = '<p class="unverified">Loading Loan Applications...</p>';
apiGetFetch('/loans')
  .then((data) => {
    if (data.status === 200) {
      feedbackDiv.innerHTML = '';
      if (data.data.length < 1) {
        feedbackDiv.innerHTML = '<p>There are no loan applications yet</p>';
      } else {
        data.data.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        renderLoanApplications(data.data);
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
