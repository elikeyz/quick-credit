import repayments from '../../models/repayments';

const addNewRepayment = (loan, paidAmount) => {
  const newRepayment = {
    id: repayments.length + 1,
    createdOn: new Date().toLocaleString(),
    loanId: loan.id,
    amount: loan.amount,
    monthlyInstallment: loan.paymentInstallment,
    paidAmount: Number(paidAmount),
    balance: loan.balance - Number(paidAmount),
  };
  repayments.push(newRepayment);
  return newRepayment;
};

export default addNewRepayment;
