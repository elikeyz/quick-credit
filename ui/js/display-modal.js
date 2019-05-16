const setModalBtnClickEvent = (modalOpenBtn, modalCancelBtnId, modalCloseBtnId, modalId) => {
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
  });
};

const displayModal = (modalId, modalCancelBtnId, modalCloseBtnId, modalOpenBtnId, dataCount) => {
  const modal = document.getElementById(modalId);

  if (dataCount) {
    for (let loanId = 1; loanId <= dataCount; loanId += 1) {
      setModalBtnClickEvent(`${modalOpenBtnId}-${loanId}`, modalCancelBtnId, modalCloseBtnId, modalId);
    }
  } else {
    setModalBtnClickEvent(modalOpenBtnId, modalCancelBtnId, modalCloseBtnId, modalId);
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};
