const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    localStorage.removeItem('quick-credit-access-data');
    location = './index.html';
});
