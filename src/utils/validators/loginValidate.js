import validateEmailAndPassword from './validateEmailAndPassword';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loginValidate = (req, res, next) => {
  const emailAndPasswordError = validateEmailAndPassword(req, res, next);
  if (emailAndPasswordError) {
    const [status, message] = emailAndPasswordError;
    sendErrorResponse(res, status, message);
    return;
  }
  next();
};

export default loginValidate;
