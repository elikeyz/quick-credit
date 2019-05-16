const allTab = document.getElementById('all-tab');
const currentTab = document.getElementById('current-tab');
const repaidTab = document.getElementById('repaid-tab');
const tabs = [allTab, currentTab, repaidTab];

const openTab = (myTab) => {
  tabs.forEach((tab) => {
    tab.classList.remove('active-tab');
  });
  myTab.classList.add('active-tab');
};

allTab.addEventListener('click', () => {
  openTab(allTab);
});

currentTab.addEventListener('click', () => {
  openTab(currentTab);
});

repaidTab.addEventListener('click', () => {
  openTab(repaidTab);
});
