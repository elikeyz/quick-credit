import express from 'express';
import usersController from '../controllers/usersController';
import loansController from '../controllers/loansController';
import signupValidate from './validators/signupValidate';
import signupValidate2 from './validators/signupValidate2';
import signupVerify from './verifiers/signupVerify';
import loginValidate from './validators/loginValidate';
import loginVerify from './verifiers/loginVerify';
import checkIfClientExists from './verifiers/checkIfClientExists';
import checkIfLoanExists from './verifiers/checkIfLoanExists';

const router = express.Router();
const { signup, login, verifyClient } = usersController;
const { getALoan } = loansController;

router.post('/auth/signup', signupValidate, signupValidate2, signupVerify, signup);
router.post('/auth/signin', loginValidate, loginVerify, login);
router.patch('/users/:userEmail/verify', checkIfClientExists, verifyClient);
router.get('/loans/:loanId', checkIfLoanExists, getALoan);

export default router;
