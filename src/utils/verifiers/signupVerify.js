import users from '../../models/users';
import sendErrorResponse from '../helpers/sendErrorResponse';

const preventUserDuplicate = (req, res, next) => {
  const similarUsers = users.filter(user => user.email === req.body.email);
  if (similarUsers.length > 0) {
    sendErrorResponse(res, 409, 'A user account with the same email already exists');
  } else {
    next();
  }
};

export default preventUserDuplicate;
