const formModal = document.getElementById('loan-repayment-form-modal');
const modalBtn = document.getElementById('open-form-modal');

modalBtn.addEventListener('click', (event) => {
    event.preventDefault();
    formModal.style.display = 'block';

    const cancelBtn = document.getElementById('cancel-form-btn');

    cancelBtn.addEventListener('click', () => {
        formModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if(event.target == formModal) {
        formModal.style.display = 'none';
    }
});