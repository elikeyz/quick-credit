import repayments from '../models/repayments';
import loans from '../models/loans';
import updateLoan from '../utils/helpers/updateLoan';
import addNewRepayment from '../utils/helpers/addNewRepayment';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';

const getLoanRepayments = (req, res) => {
  const loanRepayments = repayments.filter(repayment => repayment.loanId
                                           === parseInt(req.params.loanId, 10));
  sendSuccessResponse(res, 200, loanRepayments);
};

const postClientRepaymentTranx = (req, res) => {
  loans.forEach((loan, loanIndex) => {
    if (loan.id === parseInt(req.params.loanId, 10)) {
      let repaidStatus = false;
      if (loan.balance === Number(req.body.paidAmount)) {
        repaidStatus = true;
      }
      updateLoan(loan, loanIndex, req.body.paidAmount, repaidStatus);
      const newRepayment = addNewRepayment(loan, req.body.paidAmount);
      sendSuccessResponse(res, 201, newRepayment);
    }
  });
};

const repaymentsController = {
  getLoanRepayments,
  postClientRepaymentTranx,
};

export default repaymentsController;
