import sendErrorResponse from '../helpers/sendErrorResponse';

const loanValidate3 = (req, res, next) => {
  if (Number(req.body.amount) <= 0) {
    sendErrorResponse(res, 400, 'The loan amount specified must be greater than 0');
  } else if (parseInt(req.body.tenor, 10) < 1 || parseInt(req.body.tenor, 10) > 12) {
    sendErrorResponse(res, 400, 'The tenor specified must be in the range of 1 to 12');
  } else {
    next();
  }
};

export default loanValidate3;
