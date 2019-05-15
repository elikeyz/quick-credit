import sendErrorResponse from '../helpers/sendErrorResponse';

const validateTenorAndAmount = (req, res, next) => {
  if (!req.body.tenor) {
    sendErrorResponse(res, 400, 'You did not specify the number of months in the tenor period');
  } else if (Number.isNaN(Number(req.body.amount))) {
    sendErrorResponse(res, 400, 'The loan amount specified must be a valid number');
  } else if (Number.isNaN(parseInt(req.body.tenor, 10))) {
    sendErrorResponse(res, 400, 'The tenor specified must be an integer');
  } else {
    next();
  }
};

export default validateTenorAndAmount;
