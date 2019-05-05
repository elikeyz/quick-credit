const repaymentValidate2 = (req, res, next) => {
  if (req.loan.balance <= req.loan.paymentInstallment
        && Number(req.body.paidAmount) !== req.loan.balance) {
    res.status(403).send({
      status: 403,
      error: `The paid amount must equal the loan debt balance of ${req.loan.balance} since the loan debt balance is less than the monthly installment of ${req.loan.paymentInstallment}`,
    });
  } else if (req.loan.balance > req.loan.paymentInstallment
      && Number(req.body.paidAmount) < req.loan.paymentInstallment) {
    res.status(403).send({
      status: 403,
      error: `The paid amount must not be less than the monthly installment of ${req.loan.paymentInstallment}`,
    });
  } else if (req.loan.balance > req.loan.paymentInstallment
             && Number(req.body.paidAmount) > req.loan.balance) {
    res.status(403).send({
      status: 403,
      error: `The paid amount must not exceed the loan debt balance of ${req.loan.balance}`,
    });
  } else {
    next();
  }
};

export default repaymentValidate2;
