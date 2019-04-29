import users from '../models/users';

const signup = (req, res) => {
  res.status(201).send({
    status: 201,
    data: {
      token: '45erkjherht45495783',
      id: users.length + 1,
      email: req.body.email.trim(),
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      password: req.body.password,
      address: req.body.address.trim(),
      workAddress: req.body.workAddress.trim(),
      status: 'unverified',
      isAdmin: false,
    },
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
      password: req.body.password,
      address: req.user.address,
      workAddress: req.user.workAddress,
      status: req.user.status,
      isAdmin: req.user.isAdmin,
    },
  });
};

const usersController = {
  signup,
  login,
};

export default usersController;
