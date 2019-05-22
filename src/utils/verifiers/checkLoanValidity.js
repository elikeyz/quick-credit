import sendErrorResponse from '../helpers/sendErrorResponse';

const checkLoanValidity = (req, res, next) => {
  if (req.loan.status !== 'approved') {
    sendErrorResponse(res, 403, 'This loan application has not been approved');
  } else {
    next();
  }
};

export default checkLoanValidity;
