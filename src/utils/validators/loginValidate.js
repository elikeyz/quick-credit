const loginValidate = (req, res, next) => {
  if (!req.body.email || !req.body.email.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter your email',
    });
  } else if (!req.body.password) {
    res.status(400).send({
      status: 400,
      error: 'You did not enter your password',
    });
  } else {
    next();
  }
};

export default loginValidate;
