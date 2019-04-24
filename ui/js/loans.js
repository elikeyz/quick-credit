const allTab = document.getElementById('all-tab');
const currentTab = document.getElementById('current-tab');
const repaidTab = document.getElementById('repaid-tab');
const tabs = [allTab, currentTab, repaidTab];
const modal = document.getElementById('loan-modal');

allTab.addEventListener('click', () => {
    tabs.forEach((tab) => {
        tab.classList.remove('active-tab');
    });
    allTab.classList.add('active-tab');
});

currentTab.addEventListener('click', () => {
    tabs.forEach((tab) => {
        tab.classList.remove('active-tab');
    });
    currentTab.classList.add('active-tab');
});

repaidTab.addEventListener('click', () => {
    tabs.forEach((tab) => {
        tab.classList.remove('active-tab');
    });
    repaidTab.classList.add('active-tab');
});

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