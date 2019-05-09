import loans from '../../models/loans';

const updateLoan = (loan, loanIndex, paidAmount, repaidStatus) => {
  const updatedLoan = {
    id: loan.id,
    user: loan.user,
    firstName: loan.firstName,
    lastName: loan.lastName,
    createdOn: loan.createdOn,
    updatedOn: new Date().toLocaleString(),
    purpose: loan.purpose,
    status: loan.status,
    repaid: repaidStatus,
    tenor: loan.tenor,
    amount: loan.amount,
    paymentInstallment: loan.paymentInstallment,
    balance: loan.balance - Number(paidAmount),
    interest: loan.interest,
  };
  loans.splice(loanIndex, 1, updatedLoan);
};

export default updateLoan;
