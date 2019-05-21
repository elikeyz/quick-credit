import express from 'express';
import usersController from '../controllers/usersController';
import signupValidate from '../utils/validators/signupValidate';
import signupVerify from '../utils/verifiers/signupVerify';
import loginValidate from '../utils/validators/loginValidate';
import loginVerify from '../utils/verifiers/loginVerify';

const authRouter = express.Router();
const { signup, login } = usersController;

authRouter.post('/auth/signup',
  signupValidate,
  signupVerify,
  signup);
authRouter.post('/auth/signin',
  loginValidate,
  loginVerify,
  login);

export default authRouter;
