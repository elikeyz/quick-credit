import express from 'express';
import usersController from '../controllers/usersController';
import signupValidate from './validators/signupValidate';
import signupValidate2 from './validators/signupValidate2';
import preventUserDuplicate from './verifiers/preventUserDuplicate';
import loginValidate from './validators/loginValidate';
import loginVerify from './verifiers/loginVerify';

const router = express.Router();
const { signup, login } = usersController;

router.post('/auth/signup', signupValidate, signupValidate2, preventUserDuplicate, signup);
router.post('/auth/signin', loginValidate, loginVerify, login);

export default router;
