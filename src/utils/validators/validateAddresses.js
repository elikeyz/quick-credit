import sendErrorResponse from '../helpers/sendErrorResponse';

const validateAddresses = (req, res, next) => {
  if (!req.body.address || !req.body.address.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the home address');
  } else if (!req.body.workAddress || !req.body.workAddress.trim()) {
    sendErrorResponse(res, 400, 'You did not enter the work address');
  } else {
    next();
  }
};

export default validateAddresses;
