const validateTenorAndAmount = (req) => {
  if (!req.body.tenor) {
    return [400, 'You did not specify the number of months in the tenor period'];
  }
  if (Number.isNaN(Number(req.body.amount))) {
    return [400, 'The loan amount specified must be a valid number'];
  }
  if (Number.isNaN(parseInt(req.body.tenor, 10))) {
    return [400, 'The tenor specified must be an integer'];
  }
  return null;
};

export default validateTenorAndAmount;
