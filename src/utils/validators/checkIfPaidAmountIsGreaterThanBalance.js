import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfPaidAmountIsGreaterThanBalance = (req, res, next) => {
  if (req.loan.balance > req.loan.paymentinstallment
        && Number(req.body.paidAmount) > req.loan.balance) {
    sendErrorResponse(res, 422, `The paid amount must not exceed the loan debt balance of ${req.loan.balance}`);
  } else {
    next();
  }
};

export default checkIfPaidAmountIsGreaterThanBalance;
