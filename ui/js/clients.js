const clientsTable = document.getElementById('clients-table');
const feedbackDiv = document.getElementById('feedback');

// Render the head section of the modal display
const renderDisplayHeader = ({ firstname, lastname, email }) => {
  const modalUsernameContainer = document.getElementById('client-username-container');
  const userdataHtml = `<img class="avatar" src="./images/avatar.png" alt="Avatar">
                          <p><strong>${firstname} ${lastname}</strong></p>
                          <p>${email}</p>`;
  modalUsernameContainer.innerHTML = userdataHtml;
};

// Render the body section of the client modal
const renderClientBody = ({ address, workaddress, status }) => {
  let statusHtml = '';
  let verifyBtnHtml = '';
  if (status === 'verified') {
    statusHtml = '<p class="profile-value display-text">Verified <span class="verified"><i class="fas fa-check"></i></span></p>';
  } else if (status === 'unverified') {
    statusHtml = '<p class="profile-value display-text">Unverified <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></p>';
    verifyBtnHtml = '<button class="form-button" id="verify-btn">Verify</button>';
  }
  const clientBody = document.getElementById('client-body');
  const clientBodyHtml = `<div class="profile-unit">
                            <p class="profile-key display-text"><span><i class="fas fa-home"></i></span> Residential Address</p>
                            <p class="profile-value display-text">${address}</p>
                          </div>
                          <div class="profile-unit">
                            <p class="profile-key display-text"><span><i class="fas fa-city"></i></span> Office Address</p>
                            <p class="profile-value display-text">${workaddress}</p>
                          </div>
                          <div class="profile-unit">
                            <p class="profile-key display-text"><span><i class="fas fa-user"></i></span> Status</p>
                            ${statusHtml}
                          </div>
                          <div class="modal-btn-unit">
                            ${verifyBtnHtml}
                            <button class="form-button btn-two" id="cancel-btn">Cancel</button>
                          </div>
                          <div class="modal-feedback" id="modal-feedback"></div>`;
  clientBody.innerHTML = clientBodyHtml;
};

// Set a click listener on the Verify button to mark the client as verified
const setupClientVerification = ({ status, id }) => {
  if (status === 'unverified') {
    const verifyBtn = document.getElementById('verify-btn');
    const modalFeedbackDiv = document.getElementById('modal-feedback');
    verifyBtn.addEventListener('click', () => {
      modalFeedbackDiv.innerHTML = '<p class="unverified">Verifying Client...</p>';
      apiFetch(`/users/${id}/verify`, 'PATCH')
        .then((data) => {
          if (data.status === 200) {
            modalFeedbackDiv.innerHTML = '<p class="verified">Client has been successfully marked as Verified</p>';
            location.reload();
          } else if (data.status === 401) {
            location.assign('./login.html');
          } else {
            modalFeedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
          }
        })
        .catch((err) => {
          modalFeedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
        });
    });
  }
};

// Render the entire content of the client modal
const renderClientModalContent = (client) => {
  renderDisplayHeader(client);
  renderClientBody(client);
  setupClientVerification(client);
};

// Set the View button click event listeners on the client entries
const setupClientView = (clients) => {
  const clientIds = clients.map(client => client.id);
  const setupClientModalContent = (clientId) => {
    const myClient = clients.filter(client => client.id === clientId)[0];
    renderClientModalContent(myClient);
  };
  displayModal('client-modal', 'cancel-btn', 'close-btn', 'open-modal', clientIds, setupClientModalContent);
};

// Render the clients data in the table
const renderClients = (clients) => {
  clients.forEach(({
    firstname, lastname, email, status, id,
  }) => {
    let statusHtml = '';
    if (status === 'verified') {
      statusHtml = '<td class="clients-table-unit">Verified <span class="verified"><i class="fas fa-check"></i></span></td>';
    } else if (status === 'unverified') {
      statusHtml = '<td class="clients-table-unit">Unverified <span class="unverified"><i class="fas fa-exclamation-triangle"></i></span></td>';
    }
    const clientHtml = `<tr>
                            <td class="clients-table-unit">${firstname} ${lastname}</td>
                            <td class="clients-table-unit">${email}</td>
                            ${statusHtml}
                            <td class="clients-table-unit"><button class="table-button" id="open-modal-${id}"><span><i class="fas fa-eye"></i></span> View</button></td>
                        </tr>`;
    clientsTable.insertAdjacentHTML('beforeend', clientHtml);
  });
  setupClientView(clients);
};

// Fetch the client information from the API for rendering
feedbackDiv.innerHTML = '<p class="unverified">Loading Registered Clients...</p>';
apiGetFetch('/users')
  .then((data) => {
    if (data.status === 200) {
      feedbackDiv.innerHTML = '';
      if (data.data.length < 1) {
        feedbackDiv.innerHTML = '<p>There are no registered clients yet</p>';
      } else {
        data.data.sort((a, b) => {
          if (a.firstname < b.firstname) return -1;
          if (a.firstname > b.firstname) return 1;
          return 0;
        });
        renderClients(data.data);
      }
    } else if (data.status === 401) {
      location.assign('./login.html');
    } else {
      feedbackDiv.innerHTML = `<p class="rejected">${data.error}</p>`;
    }
  })
  .catch((err) => {
    feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
  });
