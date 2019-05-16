import express from 'express';
import usersController from '../controllers/usersController';
import loansController from '../controllers/loansController';
import repaymentsController from '../controllers/repaymentsController';
import validateName from './validators/validateName';
import validateAddresses from './validators/validateAddresses';
import validateEmailAndPasswordPattern from './validators/validateEmailAndPasswordPattern';
import signupVerify from './verifiers/signupVerify';
import validateEmailAndPassword from './validators/validateEmailAndPassword';
import loginVerify from './verifiers/loginVerify';
import checkIfClientExists from './verifiers/checkIfClientExists';
import checkIfClientIsAdmin from './verifiers/checkIfClientIsAdmin';
import loanIdValidate from './validators/loanIdValidate';
import checkIfLoanExists from './verifiers/checkIfLoanExists';
import loansQueryValidate from './validators/loansQueryValidate';
import validatePurposeAndAmount from './validators/validatePurposeAndAmount';
import validateTenorAndAmount from './validators/validateTenorAndAmount';
import validateTenorAndAmountValues from './validators/validateTenorAndAmountValues';
import checkClientValidity from './verifiers/checkClientValidity';
import restrictNumberOfLoanApplications from './verifiers/restrictNumberOfLoanApplications';
import loanResponseValidate from './validators/loanResponseValidate';
import validateRepaidAndPaidAmount from './validators/validateRepaidAndPaidAmount';
import checkIfPaidAmountIsLessThanInstallment from './validators/checkIfPaidAmountIsLessThanInstallment';
import checkIfPaidAmountIsGreaterThanBalance from './validators/checkIfPaidAmountIsGreaterThanBalance';
import tokenValidate from './validators/tokenValidate';
import adminAuth from './verifiers/adminAuth';
import userAuth from './verifiers/userAuth';
import filterMyLoans from './verifiers/filterMyLoans';

const router = express.Router();
const {
  signup, login, verifyClient, getClients, getAClient, getMyUserDetails, getMyLoans,
} = usersController;
const {
  getALoan, getLoans, requestLoan, respondToLoanRequest,
} = loansController;
const { getLoanRepayments, postClientRepaymentTranx } = repaymentsController;

router.post('/auth/signup', validateEmailAndPassword, validateName, validateAddresses, validateEmailAndPasswordPattern, signupVerify, signup);
router.post('/auth/signin', validateEmailAndPassword, loginVerify, login);
router.get('/users', tokenValidate, adminAuth, getClients);
router.get('/users/me', tokenValidate, getMyUserDetails);
router.get('/users/me/loans', tokenValidate, filterMyLoans, getMyLoans);
router.get('/users/:userEmail', tokenValidate, adminAuth, checkIfClientExists, checkIfClientIsAdmin, getAClient);
router.patch('/users/:userEmail/verify', tokenValidate, adminAuth, checkIfClientExists, checkIfClientIsAdmin, verifyClient);
router.get('/loans', tokenValidate, adminAuth, loansQueryValidate, getLoans);
router.get('/loans/:loanId', tokenValidate, loanIdValidate, checkIfLoanExists, userAuth, getALoan);
router.post('/loans', tokenValidate, validatePurposeAndAmount, validateTenorAndAmount, validateTenorAndAmountValues, checkClientValidity, restrictNumberOfLoanApplications, requestLoan);
router.patch('/loans/:loanId', tokenValidate, adminAuth, loanIdValidate, checkIfLoanExists, loanResponseValidate, respondToLoanRequest);
router.get('/loans/:loanId/repayments', tokenValidate, loanIdValidate, checkIfLoanExists, userAuth, getLoanRepayments);
router.post('/loans/:loanId/repayments', tokenValidate, adminAuth, loanIdValidate, checkIfLoanExists, validateRepaidAndPaidAmount, checkIfPaidAmountIsLessThanInstallment, checkIfPaidAmountIsGreaterThanBalance, postClientRepaymentTranx);

export default router;
