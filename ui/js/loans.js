const allTab = document.getElementById('all-tab');
const currentTab = document.getElementById('current-tab');
const repaidTab = document.getElementById('repaid-tab');
const tabs = [allTab, currentTab, repaidTab];
let loanMode = 'all';

// Set the active tab style on the clicked tab
const openTab = (myTab) => {
  tabs.forEach((tab) => {
    tab.classList.remove('active-tab');
  });
  myTab.classList.add('active-tab');
};

// Fetch and render all the loans in the table
allTab.addEventListener('click', () => {
  openTab(allTab);
  if (loanMode !== 'all') {
    loanMode = 'all';
    fetchLoans('/loans?status=approved', 'Loading Loans', 'There are no active loans presently');
  }
});

// Fetch and render all the current loans in the table
currentTab.addEventListener('click', () => {
  openTab(currentTab);
  if (loanMode !== 'current') {
    loanMode = 'current';
    fetchLoans('/loans?status=approved&repaid=false', 'Loading Current Loans', 'There are no unrepaid loans presently');
  }
});

// Fetch and render all the repaid loans in the table
repaidTab.addEventListener('click', () => {
  openTab(repaidTab);
  if (loanMode !== 'repaid') {
    loanMode = 'repaid';
    fetchLoans('/loans?status=approved&repaid=true', 'Loading Repaid Loans', 'There are no repaid loans presently');
  }
});
