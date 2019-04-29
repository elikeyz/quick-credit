import express from 'express';
import signupValidate from './validators/signupValidate';
import signupValidate2 from './validators/signupValidate2';
import preventUserDuplicate from './verifiers/preventUserDuplicate';
import usersController from '../controllers/usersController';

const router = express.Router();
const { signup } = usersController;

router.post('/auth/signup', signupValidate, signupValidate2, preventUserDuplicate, signup);

export default router;
