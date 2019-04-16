const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    location = './loan-repayments.html';
});