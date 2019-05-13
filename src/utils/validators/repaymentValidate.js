import sendErrorResponse from '../helpers/sendErrorResponse';

const repaymentValidate = (req, res, next) => {
  if (!req.body.paidAmount) {
    sendErrorResponse(res, 400, 'You did not specify the paid amount');
  } else if (Number.isNaN(Number(req.body.paidAmount))) {
    sendErrorResponse(res, 400, 'The paid amount specified must be a valid number');
  } else if (req.loan.repaid) {
    sendErrorResponse(res, 403, 'The loan specified has been fully repaid');
  } else {
    next();
  }
};

export default repaymentValidate;
