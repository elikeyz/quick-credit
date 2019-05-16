const modal = document.getElementById('client-modal');

const openClientsModal = (event) => {
  event.preventDefault();
  modal.style.display = 'flex';

  const cancelBtn = document.getElementById('cancel-btn');
  const closeBtn = document.getElementById('close-btn');

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
};

for (let clientId = 1; clientId <= 3; clientId += 1) {
  const modalBtn = document.getElementById(`open-modal-${clientId}`);

  modalBtn.addEventListener('click', openClientsModal);
}

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
