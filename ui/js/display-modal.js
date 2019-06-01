const setModalBtnClickEvent = (
  modalOpenBtn, modalCancelBtnId, modalCloseBtnId, modalId, id, setupModalContent,
) => {
  const modal = document.getElementById(modalId);
  const modalBtn = document.getElementById(modalOpenBtn);
  modalBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';

    const cancelBtn = document.getElementById(modalCancelBtnId);
    const closeBtn = document.getElementById(modalCloseBtnId);

    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    if (setupModalContent) {
      setupModalContent(id);
    }
  });
};

const displayModal = (
  modalId, modalCancelBtnId, modalCloseBtnId, modalOpenBtnId, ids, setupModalContent,
) => {
  const modal = document.getElementById(modalId);

  if (ids) {
    ids.forEach((id) => {
      setModalBtnClickEvent(`${modalOpenBtnId}-${id}`, modalCancelBtnId, modalCloseBtnId, modalId, id, setupModalContent);
    });
  } else {
    setModalBtnClickEvent(modalOpenBtnId, modalCancelBtnId, modalCloseBtnId, modalId);
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};
