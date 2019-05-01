import loans from '../models/loans';

const getALoan = (req, res) => {
  res.status(200).send({
    status: 200,
    data: req.loan,
  });
};

const getLoans = (req, res) => {
  const loansNeeded = [...loans];
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
