const modal = document.getElementById('loan-application-modal');

for (let loanId = 1; loanId <= 3; loanId++) {
    const modalBtn = document.getElementById(`open-modal-${loanId}`);

    modalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';
    
        const cancelBtn = document.getElementById('cancel-btn');
    
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });
}

window.addEventListener('click', (event) => {
    if(event.target == modal) {
        modal.style.display = 'none';
    }
});