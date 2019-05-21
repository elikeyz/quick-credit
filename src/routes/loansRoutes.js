import express from 'express';
import loansController from '../controllers/loansController';
import repaymentsController from '../controllers/repaymentsController';
import loanIdValidate from '../utils/validators/loanIdValidate';
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
  loanIdValidate,
  loanResponseValidate,
  respondToLoanRequest);
loansRouter.get('/loans/:loanId/repayments',
  tokenValidate,
  loanIdValidate,
  userAuth,
  getLoanRepayments);
loansRouter.post('/loans/:loanId/repayments',
  tokenValidate,
  adminAuth,
  loanIdValidate,
  validateRepaidAndPaidAmount,
  checkIfPaidAmountIsLessThanInstallment,
  checkIfPaidAmountIsGreaterThanBalance,
  postClientRepaymentTranx);

export default loansRouter;
