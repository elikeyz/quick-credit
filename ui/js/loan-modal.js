const loanModal = document.getElementById('loan-modal');

const openLoanModal = (event) => {
  event.preventDefault();
  loanModal.style.display = 'flex';

  const cancelBtn = document.getElementById('loan-cancel-btn');

  cancelBtn.addEventListener('click', () => {
    loanModal.style.display = 'none';
  });
};

for (let loanId = 1; loanId <= 3; loanId += 1) {
  const loanModalBtn = document.getElementById(`open-loan-modal-${loanId}`);
  loanModalBtn.addEventListener('click', openLoanModal);
}

window.addEventListener('click', (event) => {
  if (event.target === loanModal) {
    loanModal.style.display = 'none';
  }
});
