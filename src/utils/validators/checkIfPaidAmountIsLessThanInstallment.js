import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfPaidAmountIsLessThanInstallment = (req, res, next) => {
  if (req.loan.balance <= req.loan.paymentInstallment
        && Number(req.body.paidAmount) !== req.loan.balance) {
    sendErrorResponse(res, 422, `The paid amount must equal the loan debt balance of ${req.loan.balance} since the loan debt balance is less than the monthly installment of ${req.loan.paymentInstallment}`);
  } else if (req.loan.balance > req.loan.paymentInstallment
      && Number(req.body.paidAmount) < req.loan.paymentInstallment) {
    sendErrorResponse(res, 422, `The paid amount must not be less than the monthly installment of ${req.loan.paymentInstallment}`);
  } else {
    next();
  }
};

export default checkIfPaidAmountIsLessThanInstallment;
