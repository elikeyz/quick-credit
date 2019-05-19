import sendErrorResponse from '../helpers/sendErrorResponse';

const checkIfClientIsAdmin = (req, res, next) => {
  if (req.client.isadmin) {
    sendErrorResponse(res, 403, 'You are not authorized to view the user details of an admin account');
  } else {
    next();
  }
};

export default checkIfClientIsAdmin;
