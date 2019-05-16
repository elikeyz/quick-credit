import sendErrorResponse from '../helpers/sendErrorResponse';

const validateEmailAndPassword = (req, res, next) => {
  if (!req.body.email || !req.body.email.trim()) {
    sendErrorResponse(res, 400, 'You did not enter your email');
  } else if (!req.body.password) {
    sendErrorResponse(res, 400, 'You did not enter your password');
  } else {
    next();
  }
};

export default validateEmailAndPassword;
