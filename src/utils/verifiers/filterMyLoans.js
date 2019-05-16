import loans from '../../models/loans';

const filterMyLoans = (req, res, next) => {
  const myLoans = loans.filter(loan => loan.user === req.user.email);
  req.myLoans = myLoans;
  next();
};

export default filterMyLoans;
