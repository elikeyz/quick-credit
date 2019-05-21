import validateEmailAndPassword from './validateEmailAndPassword';
import validateName from './validateName';
import validateAddresses from './validateAddresses';
import validateEmailAndPasswordPattern from './validateEmailAndPasswordPattern';
import sendErrorResponse from '../helpers/sendErrorResponse';

const signupValidate = (req, res, next) => {
  const emailAndPasswordError = validateEmailAndPassword(req);
  if (emailAndPasswordError) {
    const [status, message] = emailAndPasswordError;
    sendErrorResponse(res, status, message);
    return;
  }
  const nameError = validateName(req);
  if (nameError) {
    const [status, message] = nameError;
    sendErrorResponse(res, status, message);
    return;
  }
  const addressError = validateAddresses(req);
  if (addressError) {
    const [status, message] = addressError;
    sendErrorResponse(res, status, message);
    return;
  }
  const emailAndPasswordPatternError = validateEmailAndPasswordPattern(req);
  if (emailAndPasswordPatternError) {
    const [status, message] = emailAndPasswordPatternError;
    sendErrorResponse(res, status, message);
    return;
  }
  next();
};

export default signupValidate;
