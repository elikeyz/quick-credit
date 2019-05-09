import loans from '../../models/loans';
import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfLoanExists = (req, res, next) => {
  const loanMatch = loans.filter(loan => loan.id === parseInt(req.params.loanId, 10));
  if (loanMatch.length < 1) {
    sendErrorResponse(res, 404, 'The loan specified does not exist');
  } else {
    const [loan] = loanMatch;
    req.loan = loan;
    next();
  }
};

export default checkIfLoanExists;
