import sendErrorResponse from '../helpers/sendErrorResponse';

const loansQueryValidate = (req, res, next) => {
  if (req.query.status && req.query.status !== 'approved' && req.query.status !== 'rejected' && req.query.status !== 'pending') {
    sendErrorResponse(res, 400, 'The only valid values for the status query are \'approved\', \'rejected\' and \'pending\'');
  } else if (req.query.repaid && req.query.repaid !== 'true' && req.query.repaid !== 'false') {
    sendErrorResponse(res, 400, 'The only valid values for the repaid query are \'true\' and \'false\'');
  } else {
    next();
  }
};

export default loansQueryValidate;
