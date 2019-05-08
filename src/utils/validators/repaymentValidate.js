const repaymentValidate = (req, res, next) => {
  if (!req.body.paidAmount) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the paid amount',
    });
  } else if (Number.isNaN(Number(req.body.paidAmount))) {
    res.status(400).send({
      status: 400,
      error: 'The paid amount specified must be a valid number',
    });
  } else if (req.loan.repaid) {
    res.status(403).send({
      status: 403,
      error: 'The loan specified has been fully repaid',
    });
  } else {
    next();
  }
};

export default repaymentValidate;
