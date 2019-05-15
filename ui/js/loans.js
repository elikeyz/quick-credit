const allTab = document.getElementById('all-tab');
const currentTab = document.getElementById('current-tab');
const repaidTab = document.getElementById('repaid-tab');
const tabs = [allTab, currentTab, repaidTab];

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
