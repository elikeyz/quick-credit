const signupValidate = (req, res, next) => {
  if (!req.body.email || !req.body.email.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the email',
    });
  } else if (!req.body.firstName || !req.body.firstName.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the first name',
    });
  } else if (!req.body.lastName || !req.body.lastName.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the last name',
    });
  } else if (!req.body.password) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter the password',
    });
  } else {
    next();
  }
};

export default signupValidate;
