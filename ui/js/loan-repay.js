const formModal = document.getElementById('loan-repayment-form-modal');
const modalBtn = document.getElementById('open-form-modal');

modalBtn.addEventListener('click', (event) => {
  event.preventDefault();
  formModal.style.display = 'flex';

  const cancelBtn = document.getElementById('cancel-form-btn');
  const closeBtn = document.getElementById('close-form-btn');

  cancelBtn.addEventListener('click', () => {
    formModal.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    formModal.style.display = 'none';
  });
});

window.addEventListener('click', (event) => {
  if (event.target === formModal) {
    formModal.style.display = 'none';
  }
});
