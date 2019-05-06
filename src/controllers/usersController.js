import users from '../models/users';

const signup = (req, res) => {
  const newUser = {
    id: users.length + 1,
    email: req.body.email.trim(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    password: req.body.password,
    address: req.body.address.trim(),
    workAddress: req.body.workAddress.trim(),
    status: 'unverified',
    isAdmin: false,
  };
  users.push(newUser);
  res.status(201).send({
    status: 201,
    data: { token: '45erkjherht45495783', ...newUser },
  });
};

const login = (req, res) => {
  res.status(200).send({
    status: 200,
    data: {
      token: '45erkjherht45495783',
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      password: req.user.password,
      address: req.user.address,
      workAddress: req.user.workAddress,
      status: req.user.status,
      isAdmin: req.user.isAdmin,
    },
  });
};

const verifyClient = (req, res) => {
  users.forEach((user, userIndex) => {
    if (user.email === req.params.userEmail) {
      const client = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        address: user.address,
        workAddress: user.workAddress,
        status: 'verified',
        isAdmin: user.isAdmin,
      };
      users.splice(userIndex, 1, client);
      res.status(200).send({
        status: 200,
        data: client,
      });
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
  res.status(200).send({
    status: 200,
    data: clients,
  });
};

const getAClient = (req, res) => {
  res.status(200).send({
    status: 200,
    data: {
      id: req.client.id,
      email: req.client.email,
      firstName: req.client.firstName,
      lastName: req.client.lastName,
      address: req.client.address,
      workAddress: req.client.workAddress,
      status: req.client.status,
      isAdmin: req.client.isAdmin,
    },
  });
};

const usersController = {
  signup,
  login,
  verifyClient,
  getClients,
  getAClient,
};

export default usersController;
