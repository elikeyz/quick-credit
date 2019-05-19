import sendErrorResponse from '../helpers/sendErrorResponse';

const validateEmailAndPasswordPattern = (req, res, next) => {
  // Email regex gotten from http://www.regexlib.com
  // Whitespace regex gotten from https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/regular-expressions/match-whitespace
  if (!/^.+@[^.].*\.[a-z]{2,}$/.test(req.body.email.trim())) {
    sendErrorResponse(res, 400, 'Your email address must follow the pattern ****@**.**');
  } else if (/\s/g.test(req.body.password)) {
    sendErrorResponse(res, 400, 'You must not add whitespaces in your password');
  } else {
    next();
  }
};

export default validateEmailAndPasswordPattern;
