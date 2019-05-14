import sendErrorResponse from '../helpers/sendErrorResponse';

const signupValidate3 = (req, res, next) => {
  if (!/^.+@[^.].*\.[a-z]{2,}$/.test(req.body.email.trim())) {
    sendErrorResponse(res, 400, 'Your email address must follow the pattern ****@**.**');
  } else if (/\s/g.test(req.body.password)) {
    sendErrorResponse(res, 400, 'You must not add whitespaces in your password');
  } else {
    next();
  }
};

export default signupValidate3;
