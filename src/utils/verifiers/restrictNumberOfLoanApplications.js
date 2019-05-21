import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const restrictNumberOfLoanApplications = (req, res, next) => {
  const text = 'SELECT * FROM loans WHERE client = $1 AND repaid = $2';
  const values = [req.user.email, false];
  dbconnect.query(text, values).then((result) => {
    if (result.rowCount > 0) {
      sendErrorResponse(res, 403, 'You cannot apply for more than one loan at a time');
    } else {
      next();
    }
  });
};

export default restrictNumberOfLoanApplications;
