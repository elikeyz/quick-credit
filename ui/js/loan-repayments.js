const myRepaymentsContainer = document.getElementById('my-repayments-container');
const feedbackDiv = document.getElementById('feedback');

const renderRepaymentHistory = (data) => {
  if (data.status === 200) {
    feedbackDiv.innerHTML = '';
    if (data.data.length < 1) {
      feedbackDiv.innerHTML = '<p>You have not made any loan repayments yet</p>';
    }
    data.data.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
    data.data.forEach((repayment) => {
      const repaymentHtml = `<tr>
                              <td class="repayments-table-unit">N${repayment.paidamount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td class="repayments-table-unit">${new Date(repayment.createdon).toDateString()}</td>
                              <td class="repayments-table-unit">${new Date(repayment.createdon).toLocaleTimeString()}</td>
                              <td class="repayments-table-unit">N${repayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td class="repayments-table-unit">N${repayment.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>`;
      myRepaymentsContainer.insertAdjacentHTML('beforeend', repaymentHtml);
    });
  }
};

feedbackDiv.innerHTML = '<p class="unverified">Loading Repayment History...</p>';

apiGetFetch('/users/me/repayments')
  .then(renderRepaymentHistory)
  .catch((err) => {
    feedbackDiv.innerHTML = `<p class="rejected">${err}</p>`;
  });
