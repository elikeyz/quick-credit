const validateTenorAndAmountValues = (req) => {
  if (Number(req.body.amount) <= 0) {
    return [422, 'The loan amount specified must be greater than 0'];
  }
  if (parseInt(req.body.tenor, 10) < 1 || parseInt(req.body.tenor, 10) > 12) {
    return [422, 'The tenor specified must be in the range of 1 to 12'];
  }
  return null;
};

export default validateTenorAndAmountValues;
