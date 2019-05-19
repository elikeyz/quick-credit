import bcrypt from 'bcryptjs';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';
import generateUserToken from '../utils/helpers/generateUserToken';
import dbconnect from '../utils/helpers/dbconnect';
import sendDbResponse from '../utils/helpers/sendDbResponse';

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
  const text = 'UPDATE users SET status = $1 WHERE email = $2 RETURNING id, email, firstname, lastname, address, workaddress, status, isadmin';
  const values = ['verified', req.params.userEmail];
  dbconnect.query(text, values).then((result) => {
    sendSuccessResponse(res, 200, result.rows[0]);
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
    firstName: req.client.firstname,
    lastName: req.client.lastname,
    address: req.client.address,
    workAddress: req.client.workaddress,
    status: req.client.status,
    isAdmin: req.client.isadmin,
  };
  sendSuccessResponse(res, 200, client);
};

const getMyUserDetails = (req, res) => {
  const text = 'SELECT id, email, firstname, lastname, address, workaddress, status, isadmin FROM users WHERE email = $1';
  const values = [req.user.email];
  dbconnect.query(text, values).then((result) => {
    sendSuccessResponse(res, 200, result.rows[0]);
  });
};

const getMyLoans = (req, res) => {
  if (req.query.status && req.query.repaid) {
    const statusAndRepaidText = 'SELECT * FROM loans WHERE client = $1 AND status = $2 AND repaid = $3';
    const statusAndRepaidValues = [req.user.email, req.query.status, req.query.repaid];
    sendDbResponse(res, 200, statusAndRepaidText, statusAndRepaidValues);
  } else if (req.query.status) {
    const statusText = 'SELECT * FROM loans WHERE client = $1 AND status = $2';
    const statusValues = [req.user.email, req.query.status];
    sendDbResponse(res, 200, statusText, statusValues);
  } else if (req.query.repaid) {
    const repaidText = 'SELECT * FROM loans WHERE client = $1 AND repaid = $2';
    const repaidValues = [req.user.email, req.query.repaid];
    sendDbResponse(res, 200, repaidText, repaidValues);
  } else {
    const allText = 'SELECT * FROM loans WHERE client = $1';
    const allValues = [req.user.email];
    sendDbResponse(res, 200, allText, allValues);
  }
};

const getMyLoanRepayments = (req, res) => {
  const myLoanIds = req.myLoans.map(loan => loan.id);
  dbconnect.query('SELECT * FROM repayments').then((result) => {
    const myRepayments = result.rows.filter(repayment => myLoanIds.includes(repayment.loanId));
    sendSuccessResponse(res, 200, myRepayments);
  });
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
