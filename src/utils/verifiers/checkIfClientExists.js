import users from '../../models/users';

const checkIfClientExists = (req, res, next) => {
  const clientMatch = users.filter(user => user.email === req.params.userEmail);
  if (clientMatch.length < 1) {
    res.status(404).send({
      status: 404,
      error: 'Client does not exist',
    });
  } else {
    const [client] = clientMatch;
    req.client = client;
    next();
  }
};

export default checkIfClientExists;
