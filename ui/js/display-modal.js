const displayModal = (modalId, modalCancelBtnId, modalCloseBtnId, modalOpenBtnId, dataCount) => {
  const modal = document.getElementById(modalId);

  const openModal = (event) => {
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
  };

  const setModalBtnClickEvent = (modalOpenBtn) => {
    const modalBtn = document.getElementById(modalOpenBtn);
    modalBtn.addEventListener('click', openModal);
  };

  if (dataCount) {
    for (let loanId = 1; loanId <= dataCount; loanId += 1) {
      setModalBtnClickEvent(`${modalOpenBtnId}-${loanId}`);
    }
  } else {
    setModalBtnClickEvent(modalOpenBtnId);
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};
