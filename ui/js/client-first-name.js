const userFirstName = document.getElementById('user-first-name');

const { firstname } = JSON.parse(localStorage.getItem('quick-credit-access-data'));
if (firstname) {
  userFirstName.innerHTML = `<span><i class="fas fa-user"></i></span> ${firstname}`;
}
