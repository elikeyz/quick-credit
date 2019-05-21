import express from 'express';
import usersController from '../controllers/usersController';
import checkIfClientExists from '../utils/verifiers/checkIfClientExists';
import checkIfClientIsAdmin from '../utils/verifiers/checkIfClientIsAdmin';
import loansQueryValidate from '../utils/validators/loansQueryValidate';
import tokenValidate from '../utils/validators/tokenValidate';
import adminAuth from '../utils/verifiers/adminAuth';
import filterMyLoans from '../utils/verifiers/filterMyLoans';

const usersRouter = express.Router();
const {
  verifyClient,
  getClients,
  getAClient,
  getMyUserDetails,
  getMyLoans,
  getMyLoanRepayments,
} = usersController;

usersRouter.get('/users',
  tokenValidate,
  adminAuth,
  getClients);
usersRouter.get('/users/me',
  tokenValidate,
  getMyUserDetails);
usersRouter.get('/users/me/loans',
  tokenValidate,
  loansQueryValidate,
  getMyLoans);
usersRouter.get('/users/me/repayments',
  tokenValidate,
  filterMyLoans,
  getMyLoanRepayments);
usersRouter.get('/users/:userId',
  tokenValidate,
  adminAuth,
  checkIfClientExists,
  checkIfClientIsAdmin,
  getAClient);
usersRouter.patch('/users/:userId/verify',
  tokenValidate,
  adminAuth,
  checkIfClientExists,
  checkIfClientIsAdmin,
  verifyClient);

export default usersRouter;
