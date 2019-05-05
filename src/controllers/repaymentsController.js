import repayments from '../models/repayments';
import loans from '../models/loans';

const getLoanRepayments = (req, res) => {
  const loanRepayments = repayments.filter(repayment => repayment.loanId
                                           === parseInt(req.params.loanId, 10));
  res.status(200).send({
    status: 200,
    data: loanRepayments,
  });
};

const postClientRepaymentTranx = (req, res) => {
  loans.forEach((loan, loanIndex) => {
    if (loan.id === parseInt(req.params.loanId, 10)) {
      let repaidStatus = false;
      if (loan.balance === Number(req.body.paidAmount)) {
        repaidStatus = true;
      }
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
        balance: loan.balance - Number(req.body.paidAmount),
        interest: loan.interest,
      };
      const newRepayment = {
        id: repayments.length + 1,
        createdOn: new Date().toLocaleString(),
        loanId: loan.id,
        amount: loan.amount,
        monthlyInstallment: loan.paymentInstallment,
        paidAmount: Number(req.body.paidAmount),
        balance: loan.balance - Number(req.body.paidAmount),
      };
      loans.splice(loanIndex, 1, updatedLoan);
      repayments.push(newRepayment);
      res.status(200).send({
        status: 200,
        data: {
          id: repayments.length + 1,
          createdOn: new Date().toLocaleString(),
          loanId: loan.id,
          amount: loan.amount,
          monthlyInstallment: loan.paymentInstallment,
          paidAmount: Number(req.body.paidAmount),
          balance: loan.balance - Number(req.body.paidAmount),
        },
      });
    }
  });
};

const repaymentsController = {
  getLoanRepayments,
  postClientRepaymentTranx,
};

export default repaymentsController;
