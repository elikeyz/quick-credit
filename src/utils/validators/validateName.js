import sendErrorResponse from '../helpers/sendErrorResponse';

const validateName = (req, res, next) => {
  if (!req.body.firstName || !req.body.firstName.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the first name');
  } else if (!req.body.lastName || !req.body.lastName.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the last name');
  } else {
    next();
  }
};

export default validateName;
