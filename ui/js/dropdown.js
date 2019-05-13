const dropBtn = document.getElementById('drop-btn');
const dropdownContent = document.getElementsByClassName('dropdown-content')[0];

dropBtn.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  if (dropdownContent.classList.contains('hidden')) {
    dropdownContent.classList.remove('hidden');
  } else {
    dropdownContent.classList.add('hidden');
  }
});

document.addEventListener('click', (event) => {
  if (event.target !== dropdownContent && event.target !== dropBtn && !dropdownContent.classList.contains('hidden')) {
    dropdownContent.classList.add('hidden');
  }
});
