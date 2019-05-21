const validateEmailAndPassword = (req) => {
  if (!req.body.email || !req.body.email.trim()) {
    return [400, 'You did not enter your email'];
  }
  if (!req.body.password) {
    return [400, 'You did not enter your password'];
  }
  return null;
};

export default validateEmailAndPassword;
