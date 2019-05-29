import uuidv4 from 'uuid/v4';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';
import dbconnect from '../utils/helpers/dbconnect';
import sendDbResponse from '../utils/helpers/sendDbResponse';

const getLoanRepayments = (req, res) => {
  const text = 'SELECT * FROM repayments WHERE loanid = $1';
  const values = [req.params.loanId];
  sendDbResponse(res, 200, text, values);
};

const postClientRepaymentTranx = (req, res) => {
  const repaidStatus = (req.loan.balance === Number(req.body.paidAmount));
  const updateLoanText = 'UPDATE loans SET updatedon = $1, repaid = $2, balance = $3 WHERE id = $4';
  const updateLoanValues = [
    new Date(), repaidStatus, req.loan.balance - Number(req.body.paidAmount), req.params.loanId,
  ];
  dbconnect.query(updateLoanText, updateLoanValues).then(() => {
    const createRepaymentText = 'INSERT INTO repayments(id, createdon, loanid, amount, monthlyinstallment, paidamount, balance) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const createRepaymentValues = [
      uuidv4(),
      new Date(),
      req.loan.id,
      req.loan.amount,
      req.loan.paymentinstallment,
      Number(req.body.paidAmount),
      req.loan.balance - Number(req.body.paidAmount),
    ];
    dbconnect.query(createRepaymentText, createRepaymentValues).then((result) => {
      sendSuccessResponse(res, 201, result.rows[0]);
    });
  });
};

const repaymentsController = {
  getLoanRepayments,
  postClientRepaymentTranx,
};

export default repaymentsController;
