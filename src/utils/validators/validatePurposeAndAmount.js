import sendErrorResponse from '../helpers/sendErrorResponse';

const validatePurposeAndAmount = (req, res, next) => {
  if (!req.body.user) {
    sendErrorResponse(res, 400, 'You did not specify the user email');
  } else if (!req.body.purpose || !req.body.purpose.trim()) {
    sendErrorResponse(res, 400, 'You did not specify the purpose of loan request');
  } else if (!req.body.amount) {
    sendErrorResponse(res, 400, 'You did not specify the loan amount requested');
  } else {
    next();
  }
};

export default validatePurposeAndAmount;
