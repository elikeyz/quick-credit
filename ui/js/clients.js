const modal = document.getElementById('my-modal');
const modalBtns = document.getElementsByClassName('open-modal');

for (let i = 0; i < modalBtns.length; i++) {
    modalBtns[i].addEventListener('click', (event) => {
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