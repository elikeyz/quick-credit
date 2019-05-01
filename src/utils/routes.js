import express from 'express';
import usersController from '../controllers/usersController';
import loansController from '../controllers/loansController';
import repaymentsController from '../controllers/repaymentsController';
import signupValidate from './validators/signupValidate';
import signupValidate2 from './validators/signupValidate2';
import signupVerify from './verifiers/signupVerify';
import loginValidate from './validators/loginValidate';
import loginVerify from './verifiers/loginVerify';
import checkIfClientExists from './verifiers/checkIfClientExists';
import loanIdValidate from './validators/loanIdValidate';
import checkIfLoanExists from './verifiers/checkIfLoanExists';
import loansQueryValidate from './validators/loansQueryValidate';

const router = express.Router();
const { signup, login, verifyClient } = usersController;
const { getALoan, getLoans } = loansController;
const { getLoanRepayments } = repaymentsController;

router.post('/auth/signup', signupValidate, signupValidate2, signupVerify, signup);
router.post('/auth/signin', loginValidate, loginVerify, login);
router.patch('/users/:userEmail/verify', checkIfClientExists, verifyClient);
router.get('/loans/:loanId', loanIdValidate, checkIfLoanExists, getALoan);
router.get('/loans', loansQueryValidate, getLoans);
router.get('/loans/:loanId/repayments', loanIdValidate, checkIfLoanExists, getLoanRepayments);

export default router;
