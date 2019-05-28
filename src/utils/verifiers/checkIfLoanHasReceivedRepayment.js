import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfLoanHasReceivedRepayment = (req, res, next) => {
  if (req.loan.balance < (req.loan.amount + req.loan.interest)) {
    sendErrorResponse(res, 403, 'This loan is already being repaid');
  } else {
    next();
  }
};

export default checkIfLoanHasReceivedRepayment;
