import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const preventUserDuplicate = (req, res, next) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [req.body.email];
  dbconnect.query(text, values).then((result) => {
    if (result.rowCount > 0) {
      sendErrorResponse(res, 409, 'A user account with the same email already exists');
    } else {
      next();
    }
  });
};

export default preventUserDuplicate;
