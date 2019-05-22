import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const checkIfLoanExists = (req, res, next) => {
  // UUID regex gotten from https://www.regextester.com/99148
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  if (!uuidRegex.test(req.params.loanId) || req.params.loanId.length > 36) {
    sendErrorResponse(res, 400, 'The Loan ID specified is not a valid UUID');
  } else {
    const text = 'SELECT * FROM loans WHERE id = $1';
    const values = [req.params.loanId];
    dbconnect.query(text, values).then((result) => {
      if (result.rowCount < 1) {
        sendErrorResponse(res, 404, 'The loan specified does not exist');
      } else {
        const [loan] = result.rows;
        req.loan = loan;
        next();
      }
    });
  }
};

export default checkIfLoanExists;
