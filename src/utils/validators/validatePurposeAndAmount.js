const validatePurposeAndAmount = (req) => {
  if (!req.body.purpose || !req.body.purpose.trim()) {
    return [400, 'You did not specify the purpose of loan request'];
  }
  if (!req.body.amount) {
    return [400, 'You did not specify the loan amount requested'];
  }
  return null;
};

export default validatePurposeAndAmount;
