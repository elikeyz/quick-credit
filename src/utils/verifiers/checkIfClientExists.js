import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const checkIfClientExists = (req, res, next) => {
  // UUID regex gotten from https://www.regextester.com/99148
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  if (!uuidRegex.test(req.params.userId)) {
    sendErrorResponse(res, 400, 'The Client ID specified is not a valid UUID');
  } else {
    const text = 'SELECT * FROM users WHERE id = $1';
    const values = [req.params.userId];
    dbconnect.query(text, values).then((result) => {
      if (result.rowCount < 1) {
        sendErrorResponse(res, 404, 'Client does not exist');
      } else {
        const [client] = result.rows;
        req.client = client;
        next();
      }
    });
  }
};

export default checkIfClientExists;
