const signupValidate2 = (req, res, next) => {
  if (!req.body.address || !req.body.address.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the home address',
    });
  } else if (!req.body.workAddress || !req.body.workAddress.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the work address',
    });
  } else if (!/^.+@[^.].*\.[a-z]{2,}$/.test(req.body.email.trim())) {
    res.status(400).send({
      status: 400,
      error: 'Your email address must follow the pattern ****@**.**',
    });
  } else {
    next();
  }
};

export default signupValidate2;
