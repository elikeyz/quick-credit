import users from '../../models/users';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loginVerify = (req, res, next) => {
  const userMatch = users.filter(user => user.email === req.body.email);
  if (userMatch.length < 1 || userMatch[0].password !== req.body.password) {
    sendErrorResponse(res, 401, 'The email or password you entered is incorrect');
  } else {
    const [loggedInUser] = userMatch;
    req.user = loggedInUser;
    next();
  }
};

export default loginVerify;
