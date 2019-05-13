import sendErrorResponse from '../helpers/sendErrorResponse';

const loanResponseValidate = (req, res, next) => {
  if (!req.body.status || !req.body.status.trim()) {
    sendErrorResponse(res, 400, 'You did not specify the status');
  } else if (req.body.status !== 'approved' && req.body.status !== 'rejected') {
    sendErrorResponse(res, 400, 'The only acceptable values for status are \'approved\' or \'rejected\'');
  } else {
    next();
  }
};

export default loanResponseValidate;
