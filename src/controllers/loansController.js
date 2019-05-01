import loans from '../models/loans';

const getALoan = (req, res) => {
  res.status(200).send({
    status: 200,
    data: req.loan,
  });
};

const getLoans = (req, res) => {
  let loansNeeded = [];
  if (req.query.status && req.query.repaid) {
    loansNeeded = loans.filter(loan => loan.status === req.query.status && loan.repaid === (req.query.repaid === 'true'));
  } else if (req.query.status) {
    loansNeeded = loans.filter(loan => loan.status === req.query.status);
  } else if (req.query.repaid) {
    loansNeeded = loans.filter(loan => loan.repaid === (req.query.repaid === 'true'));
  } else {
    loansNeeded = [...loans];
  }
  res.status(200).send({
    status: 200,
    data: loansNeeded,
  });
};

const loansController = {
  getALoan,
  getLoans,
};

export default loansController;
