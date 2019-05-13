import users from '../../models/users';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loanVerify = (req, res, next) => {
  const userMatch = users.filter(user => user.email === req.body.user);
  if (userMatch.length < 1) {
    sendErrorResponse(res, 404, 'Client does not exist');
  } else if (userMatch[0].isAdmin) {
    sendErrorResponse(res, 403, 'You cannot apply for a loan with an admin account');
  } else if (userMatch[0].status !== 'verified') {
    sendErrorResponse(res, 403, 'You cannot apply for a loan until your user details are verified');
  } else {
    const [user] = userMatch;
    req.user = user;
    next();
  }
};

export default loanVerify;
