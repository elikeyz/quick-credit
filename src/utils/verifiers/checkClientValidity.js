import sendErrorResponse from '../helpers/sendErrorResponse';

const checkClientValidity = (req, res, next) => {
  if (req.user.isAdmin) {
    sendErrorResponse(res, 403, 'You cannot apply for a loan with an admin account');
  } else if (req.user.status !== 'verified') {
    sendErrorResponse(res, 403, 'You cannot apply for a loan until your user details are verified');
  } else {
    next();
  }
};

export default checkClientValidity;
