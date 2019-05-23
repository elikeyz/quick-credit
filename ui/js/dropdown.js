const dropBtn = document.getElementById('drop-btn');
const dropdownContent = document.getElementsByClassName('dropdown-content')[0];

dropBtn.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  if (dropdownContent.classList.contains('hidden')) {
    dropdownContent.classList.remove('hidden');
    const logoutBtn = document.getElementById('drop-down-logout-btn');

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      localStorage.removeItem('quick-credit-access-data');
      location = './index.html';
    });
  } else {
    dropdownContent.classList.add('hidden');
  }
});

document.addEventListener('click', (event) => {
  if (event.target !== dropdownContent && event.target !== dropBtn && !dropdownContent.classList.contains('hidden')) {
    dropdownContent.classList.add('hidden');
  }
});
