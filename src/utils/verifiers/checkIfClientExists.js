import users from '../../models/users';
import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfClientExists = (req, res, next) => {
  const clientMatch = users.filter(user => user.email === req.params.userEmail);
  if (clientMatch.length < 1) {
    sendErrorResponse(res, 404, 'Client does not exist');
  } else {
    const [client] = clientMatch;
    req.client = client;
    next();
  }
};

export default checkIfClientExists;
