import loans from '../../models/loans';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loanIdValidate = (req, res, next) => {
  if (Number(req.params.loanId) !== parseInt(req.params.loanId, 10)) {
    sendErrorResponse(res, 400, 'The Loan ID parameter must be an integer');
  } else {
    const loanMatch = loans.filter(loan => loan.id === parseInt(req.params.loanId, 10));
    if (loanMatch.length < 1) {
      sendErrorResponse(res, 404, 'The loan specified does not exist');
    } else {
      const [loan] = loanMatch;
      req.loan = loan;
      next();
    }
  }
};

export default loanIdValidate;
