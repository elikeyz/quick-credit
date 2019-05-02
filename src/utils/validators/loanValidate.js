const loanValidate = (req, res, next) => {
  if (!req.body.user) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the user email',
    });
  } else if (!req.body.purpose || !req.body.purpose.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the purpose of loan request',
    });
  } else if (!req.body.amount || !req.body.amount.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the loan amount requested',
    });
  } else if (!req.body.tenor || !req.body.tenor.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the number of months in the tenor period',
    });
  } else {
    next();
  }
};

export default loanValidate;
