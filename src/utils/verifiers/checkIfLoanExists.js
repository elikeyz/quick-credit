import loans from '../../models/loans';

const checkIfLoanExists = (req, res, next) => {
  const loanMatch = loans.filter(loan => loan.id === Number(req.params.loanId));
  if (loanMatch.length < 1) {
    res.status(404).send({
      status: 404,
      error: 'The loan specified does not exist',
    });
  } else {
    const [loan] = loanMatch;
    req.loan = loan;
    next();
  }
};

export default checkIfLoanExists;
