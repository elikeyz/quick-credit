import users from '../../models/users';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loginVerify = (req, res, next) => {
  const userMatch = users.filter(user => user.email === req.body.email);
  if (userMatch.length < 1 || userMatch[0].password !== req.body.password) {
    sendErrorResponse(res, 401, 'The email or password you entered is incorrect');
  } else {
    const [loggedInUser] = userMatch;
    req.user = {
      id: loggedInUser.id,
      email: loggedInUser.email,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      address: loggedInUser.address,
      workAddress: loggedInUser.workAddress,
      status: loggedInUser.status,
      isAdmin: loggedInUser.isAdmin,
    };
    next();
  }
};

export default loginVerify;
