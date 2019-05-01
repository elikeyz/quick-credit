const loanIdValidate = (req, res, next) => {
  if (Number(req.params.loanId) !== parseInt(req.params.loanId, 10)) {
    res.status(400).send({
      status: 400,
      error: 'The Loan ID parameter must be an integer',
    });
  } else {
    next();
  }
};

export default loanIdValidate;
