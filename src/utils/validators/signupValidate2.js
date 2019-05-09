import sendErrorResponse from '../helpers/sendErrorResponse';

const signupValidate2 = (req, res, next) => {
  if (!req.body.address || !req.body.address.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the home address');
  } else if (!req.body.workAddress || !req.body.workAddress.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the work address');
  } else if (!/^.+@[^.].*\.[a-z]{2,}$/.test(req.body.email.trim())) {
    sendErrorResponse(res, 400, 'Your email address must follow the pattern ****@**.**');
  } else {
    next();
  }
};

export default signupValidate2;
