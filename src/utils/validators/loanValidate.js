import validatePurposeAndAmount from './validatePurposeAndAmount';
import validateTenorAndAmount from './validateTenorAndAmount';
import validateTenorAndAmountValues from './validateTenorAndAmountValues';
import sendErrorResponse from '../helpers/sendErrorResponse';

const loanValidate = (req, res, next) => {
  const purposeAndAmountError = validatePurposeAndAmount(req);
  if (purposeAndAmountError) {
    const [status, message] = purposeAndAmountError;
    sendErrorResponse(res, status, message);
    return;
  }
  const tenorAndAmountError = validateTenorAndAmount(req);
  if (tenorAndAmountError) {
    const [status, message] = tenorAndAmountError;
    sendErrorResponse(res, status, message);
    return;
  }
  const tenorAndAmountValuesError = validateTenorAndAmountValues(req);
  if (tenorAndAmountValuesError) {
    const [status, message] = tenorAndAmountValuesError;
    sendErrorResponse(res, status, message);
    return;
  }
  next();
};

export default loanValidate;
