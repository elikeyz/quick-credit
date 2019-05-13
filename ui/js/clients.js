const modal = document.getElementById('client-modal');

for (let clientId = 1; clientId <= 3; clientId += 1) {
  const modalBtn = document.getElementById(`open-modal-${clientId}`);

  modalBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';

    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });
}

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
