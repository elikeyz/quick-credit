const validateAddresses = (req) => {
  if (!req.body.address || !req.body.address.trim()) {
    return [400, 'You did not enter the home address'];
  }
  if (!req.body.workAddress || !req.body.workAddress.trim()) {
    return [400, 'You did not enter the work address'];
  }
  return null;
};

export default validateAddresses;
