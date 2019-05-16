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

const router = express.Router();
const {
  signup, login, verifyClient, getClients, getAClient,
} = usersController;
const {
  getALoan, getLoans, requestLoan, respondToLoanRequest,
} = loansController;
const { getLoanRepayments, postClientRepaymentTranx } = repaymentsController;

router.post('/auth/signup', validateEmailAndPassword, validateName, validateAddresses, validateEmailAndPasswordPattern, signupVerify, signup);
router.post('/auth/signin', validateEmailAndPassword, loginVerify, login);
router.get('/users', getClients);
router.get('/users/:userEmail', checkIfClientExists, checkIfClientIsAdmin, getAClient);
router.patch('/users/:userEmail/verify', checkIfClientExists, checkIfClientIsAdmin, verifyClient);
router.get('/loans', loansQueryValidate, getLoans);
router.get('/loans/:loanId', loanIdValidate, checkIfLoanExists, getALoan);
router.post('/loans', validatePurposeAndAmount, validateTenorAndAmount, validateTenorAndAmountValues, checkClientValidity, restrictNumberOfLoanApplications, requestLoan);
router.patch('/loans/:loanId', loanIdValidate, checkIfLoanExists, loanResponseValidate, respondToLoanRequest);
router.get('/loans/:loanId/repayments', loanIdValidate, checkIfLoanExists, getLoanRepayments);
router.post('/loans/:loanId/repayments', loanIdValidate, checkIfLoanExists, validateRepaidAndPaidAmount, checkIfPaidAmountIsLessThanInstallment, checkIfPaidAmountIsGreaterThanBalance, postClientRepaymentTranx);

export default router;
