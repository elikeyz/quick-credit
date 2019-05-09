import loans from '../../models/loans';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loanVerify2 = (req, res, next) => {
  const unpaidLoans = loans.filter(loan => loan.user === req.body.user && !loan.repaid);
  if (unpaidLoans.length > 0) {
    sendErrorResponse(res, 403, 'You cannot apply for more than one loan at a time');
  } else {
    next();
  }
};

export default loanVerify2;
