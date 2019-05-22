import express from 'express';
import loansController from '../controllers/loansController';
import repaymentsController from '../controllers/repaymentsController';
import checkIfLoanExists from '../utils/verifiers/checkIfLoanExists';
import loansQueryValidate from '../utils/validators/loansQueryValidate';
import loanValidate from '../utils/validators/loanValidate';
import checkClientValidity from '../utils/verifiers/checkClientValidity';
import restrictNumberOfLoanApplications from '../utils/verifiers/restrictNumberOfLoanApplications';
import loanResponseValidate from '../utils/validators/loanResponseValidate';
import validateRepaidAndPaidAmount from '../utils/validators/validateRepaidAndPaidAmount';
import checkIfPaidAmountIsLessThanInstallment from '../utils/validators/checkIfPaidAmountIsLessThanInstallment';
import checkIfPaidAmountIsGreaterThanBalance from '../utils/validators/checkIfPaidAmountIsGreaterThanBalance';
import tokenValidate from '../utils/validators/tokenValidate';
import adminAuth from '../utils/verifiers/adminAuth';
import userAuth from '../utils/verifiers/userAuth';
import checkLoanValidity from '../utils/verifiers/checkLoanValidity';

const loansRouter = express.Router();
const {
  getALoan, getLoans, requestLoan, respondToLoanRequest,
} = loansController;
const { getLoanRepayments, postClientRepaymentTranx } = repaymentsController;

loansRouter.get('/loans',
  tokenValidate,
  adminAuth,
  loansQueryValidate,
  getLoans);
loansRouter.get('/loans/:loanId',
  tokenValidate,
  checkIfLoanExists,
  userAuth,
  getALoan);
loansRouter.post('/loans',
  tokenValidate,
  loanValidate,
  checkClientValidity,
  restrictNumberOfLoanApplications,
  requestLoan);
loansRouter.patch('/loans/:loanId',
  tokenValidate,
  adminAuth,
  checkIfLoanExists,
  loanResponseValidate,
  respondToLoanRequest);
loansRouter.get('/loans/:loanId/repayments',
  tokenValidate,
  checkIfLoanExists,
  userAuth,
  getLoanRepayments);
loansRouter.post('/loans/:loanId/repayments',
  tokenValidate,
  adminAuth,
  checkIfLoanExists,
  checkLoanValidity,
  validateRepaidAndPaidAmount,
  checkIfPaidAmountIsLessThanInstallment,
  checkIfPaidAmountIsGreaterThanBalance,
  postClientRepaymentTranx);

export default loansRouter;
