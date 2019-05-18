import bcrypt from 'bcryptjs';
import users from '../models/users';
import repayments from '../models/repayments';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';
import generateUserToken from '../utils/helpers/generateUserToken';
import dbconnect from '../utils/helpers/dbconnect';

const signup = (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const text = 'INSERT INTO users(email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, firstName, lastName, address, workAddress, status, isAdmin';
  const values = [req.body.email.trim(), req.body.firstName.trim(), req.body.lastName.trim(), hashedPassword, req.body.address, req.body.workAddress, 'verified', false];
  dbconnect.query(text, values).then((result) => {
    const token = generateUserToken(result.rows[0]);
    sendSuccessResponse(res, 201, { token, ...result.rows[0] });
  });
};

const login = (req, res) => {
  const token = generateUserToken(req.user);
  const userAccount = {
    token,
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    address: req.user.address,
    workAddress: req.user.workAddress,
    status: req.user.status,
    isAdmin: req.user.isAdmin,
  };
  sendSuccessResponse(res, 200, userAccount);
};

const verifyClient = (req, res) => {
  users.forEach((user, userIndex) => {
    if (user.email === req.params.userEmail) {
      const client = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        workAddress: user.workAddress,
        status: 'verified',
        isAdmin: user.isAdmin,
      };
      users.splice(userIndex, 1, { password: user.password, ...client });
      sendSuccessResponse(res, 200, client);
    }
  });
};

const getClients = (req, res) => {
  const text = 'SELECT id, email, firstname, lastname, address, workaddress, status, isadmin FROM users WHERE isadmin = $1';
  const values = [false];
  dbconnect.query(text, values).then((result) => {
    sendSuccessResponse(res, 200, result.rows);
  });
};

const getAClient = (req, res) => {
  const client = {
    id: req.client.id,
    email: req.client.email,
    firstName: req.client.firstName,
    lastName: req.client.lastName,
    address: req.client.address,
    workAddress: req.client.workAddress,
    status: req.client.status,
    isAdmin: req.client.isAdmin,
  };
  sendSuccessResponse(res, 200, client);
};

const getMyUserDetails = (req, res) => {
  const userMatch = users.filter(user => user.email === req.user.email);
  const [me] = userMatch;
  sendSuccessResponse(res, 200, me);
};

const getMyLoans = (req, res) => {
  sendSuccessResponse(res, 200, req.myLoans);
};

const getMyLoanRepayments = (req, res) => {
  const myLoanIds = req.myLoans.map(loan => loan.id);
  const myRepayments = repayments.filter(repayment => myLoanIds.includes(repayment.loanId));
  sendSuccessResponse(res, 200, myRepayments);
};

const usersController = {
  signup,
  login,
  verifyClient,
  getClients,
  getAClient,
  getMyUserDetails,
  getMyLoans,
  getMyLoanRepayments,
};

export default usersController;
