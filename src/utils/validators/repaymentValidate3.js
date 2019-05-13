import sendErrorResponse from '../helpers/sendErrorResponse';

const repaymentValidate3 = (req, res, next) => {
  if (req.loan.balance > req.loan.paymentInstallment
        && Number(req.body.paidAmount) > req.loan.balance) {
    sendErrorResponse(res, 403, `The paid amount must not exceed the loan debt balance of ${req.loan.balance}`);
  } else {
    next();
  }
};

export default repaymentValidate3;
