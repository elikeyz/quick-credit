import uuidv4 from 'uuid/v4';
import loans from '../models/loans';
import roundOfTo2dp from '../utils/helpers/roundOfTo2dp';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';
import dbconnect from '../utils/helpers/dbconnect';
import sendDbResponse from '../utils/helpers/sendDbResponse';

const getALoan = (req, res) => {
  sendSuccessResponse(res, 200, req.loan);
};

const getLoans = (req, res) => {
  if (req.query.status && req.query.repaid) {
    const statusAndRepaidText = 'SELECT * FROM loans WHERE status = $1 AND repaid = $2';
    const statusAndRepaidValues = [req.query.status, req.query.repaid];
    sendDbResponse(res, 200, statusAndRepaidText, statusAndRepaidValues);
  } else if (req.query.status) {
    const statusText = 'SELECT * FROM loans WHERE status = $1';
    const statusValues = [req.query.status];
    sendDbResponse(res, 200, statusText, statusValues);
  } else if (req.query.repaid) {
    const repaidText = 'SELECT * FROM loans WHERE repaid = $1';
    const repaidValues = [req.query.repaid];
    sendDbResponse(res, 200, repaidText, repaidValues);
  } else {
    const allText = 'SELECT * FROM loans';
    dbconnect.query(allText).then((result) => {
      sendSuccessResponse(res, 200, result.rows);
    });
  }
};

const requestLoan = (req, res) => {
  const text = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
  const values = [
    uuidv4(),
    req.user.email,
    req.user.firstname,
    req.user.lastname,
    new Date(),
    new Date(),
    req.body.purpose,
    'pending',
    false,
    parseInt(req.body.tenor, 10),
    roundOfTo2dp(req.body.amount),
    roundOfTo2dp(Number(req.body.amount) * 1.05 / parseInt(req.body.tenor, 10)),
    roundOfTo2dp(Number(req.body.amount) * 1.05),
    roundOfTo2dp(Number(req.body.amount) * 0.05),
  ];
  dbconnect.query(text, values).then((result) => {
    sendSuccessResponse(res, 201, result.rows[0]);
  });
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
