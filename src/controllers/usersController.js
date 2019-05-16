import bcrypt from 'bcryptjs';
import users from '../models/users';
import sendSuccessResponse from '../utils/helpers/sendSuccessResponse';
import generateUserToken from '../utils/helpers/generateUserToken';

const signup = (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newUser = {
    id: users.length + 1,
    email: req.body.email.trim(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    address: req.body.address.trim(),
    workAddress: req.body.workAddress.trim(),
    status: 'unverified',
    isAdmin: false,
  };
  const token = generateUserToken(newUser);
  users.push({ password: hashedPassword, ...newUser });
  sendSuccessResponse(res, 201, { token, ...newUser });
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
  const clients = users.filter(user => !user.isAdmin)
    .map(client => ({
      id: client.id,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      address: client.address,
      workAddress: client.workAddress,
      status: client.status,
      isAdmin: client.isAdmin,
    }));
  sendSuccessResponse(res, 200, clients);
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

const usersController = {
  signup,
  login,
  verifyClient,
  getClients,
  getAClient,
  getMyUserDetails,
  getMyLoans,
};

export default usersController;
