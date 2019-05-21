const validateName = (req) => {
  if (!req.body.firstName || !req.body.firstName.trim()) {
    return [400, 'You did not enter the first name'];
  }
  if (!req.body.lastName || !req.body.lastName.trim()) {
    return [400, 'You did not enter the last name'];
  }
  return null;
};

export default validateName;
