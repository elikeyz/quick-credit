import sendErrorResponse from '../helpers/sendErrorResponse';

const loanIdValidate = (req, res, next) => {
  if (Number(req.params.loanId) !== parseInt(req.params.loanId, 10)) {
    sendErrorResponse(res, 400, 'The Loan ID parameter must be an integer');
  } else {
    next();
  }
};

export default loanIdValidate;
