const loanApplicationModal = document.getElementById('loan-application-modal');

const openLoanApplicationModal = (event) => {
  event.preventDefault();
  loanApplicationModal.style.display = 'flex';

  const cancelBtn = document.getElementById('loan-application-cancel-btn');

  cancelBtn.addEventListener('click', () => {
    loanApplicationModal.style.display = 'none';
  });
};

for (let loanId = 1; loanId <= 3; loanId += 1) {
  const loanApplicationModalBtn = document.getElementById(`open-loan-application-modal-${loanId}`);
  loanApplicationModalBtn.addEventListener('click', openLoanApplicationModal);
}

window.addEventListener('click', (event) => {
  if (event.target === loanApplicationModal) {
    loanApplicationModal.style.display = 'none';
  }
});
