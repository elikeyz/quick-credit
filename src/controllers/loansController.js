import loans from '../models/loans';
import roundOfTo2dp from '../utils/helpers/roundOfTo2dp';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';

const getALoan = (req, res) => {
  sendSuccessResponse(res, 200, req.loan);
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
  sendSuccessResponse(res, 200, loansNeeded);
};

const requestLoan = (req, res) => {
  const newLoan = {
    id: loans.length + 1,
    user: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    createdOn: new Date().toLocaleString(),
    updatedOn: new Date().toLocaleString(),
    purpose: req.body.purpose,
    status: 'pending',
    repaid: false,
    tenor: parseInt(req.body.tenor, 10),
    amount: roundOfTo2dp(req.body.amount),
    paymentInstallment: roundOfTo2dp(Number(req.body.amount) * 1.05 / parseInt(req.body.tenor, 10)),
    balance: roundOfTo2dp(Number(req.body.amount) * 1.05),
    interest: roundOfTo2dp(Number(req.body.amount) * 0.05),
  };
  loans.push(newLoan);
  sendSuccessResponse(res, 201, newLoan);
};

const respondToLoanRequest = (req, res) => {
  loans.forEach((loan, loanIndex) => {
    if (loan.id === parseInt(req.params.loanId, 10)) {
      const newLoan = {
        id: req.loan.id,
        user: req.loan.email,
        firstName: req.loan.firstName,
        lastName: req.loan.lastName,
        createdOn: req.loan.createdOn,
        updatedOn: new Date().toLocaleString(),
        purpose: req.loan.purpose,
        status: req.body.status,
        repaid: req.loan.repaid,
        tenor: req.loan.tenor,
        amount: req.loan.amount,
        paymentInstallment: req.loan.paymentInstallment,
        balance: req.loan.balance,
        interest: req.loan.interest,
      };
      loans.splice(loanIndex, 1, newLoan);
      sendSuccessResponse(res, 200, newLoan);
    }
  });
};

const loansController = {
  getALoan,
  getLoans,
  requestLoan,
  respondToLoanRequest,
};

export default loansController;
