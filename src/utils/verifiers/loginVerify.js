import bcrypt from 'bcryptjs';
import sendErrorResponse from '../helpers/sendErrorResponse';
import dbconnect from '../helpers/dbconnect';

const loginVerify = (req, res, next) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [req.body.email];
  dbconnect.query(text, values).then((result) => {
    if (result.rowCount < 1 || !bcrypt.compareSync(req.body.password, result.rows[0].password)) {
      sendErrorResponse(res, 401, 'The email or password you entered is incorrect');
    } else {
      const [loggedInUser] = result.rows;
      req.user = {
        id: loggedInUser.id,
        email: loggedInUser.email,
        firstName: loggedInUser.firstname,
        lastName: loggedInUser.lastname,
        address: loggedInUser.address,
        workAddress: loggedInUser.workaddress,
        status: loggedInUser.status,
        isAdmin: loggedInUser.isadmin,
      };
      next();
    }
  });
};

export default loginVerify;
