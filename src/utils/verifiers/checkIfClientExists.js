import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const checkIfClientExists = (req, res, next) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [req.params.userEmail];
  dbconnect.query(text, values).then((result) => {
    if (result.rowCount < 1) {
      sendErrorResponse(res, 404, 'Client does not exist');
    } else {
      const [client] = result.rows;
      req.client = client;
      next();
    }
  });
};

export default checkIfClientExists;
