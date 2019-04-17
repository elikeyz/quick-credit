const modal = document.getElementById('my-modal');
const modalBtn = document.getElementById('open-modal');

modalBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'block';

    const form = document.getElementsByTagName('form')[0];

    form.addEventListener('reset', () => {
        modal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if(event.target == modal) {
        modal.style.display = 'none';
    }
});