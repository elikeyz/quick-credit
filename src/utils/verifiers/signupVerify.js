import users from '../../models/users';

const preventUserDuplicate = (req, res, next) => {
  const similarUsers = users.filter(user => user.email === req.body.email);
  if (similarUsers.length > 0) {
    res.status(409).send({
      status: 409,
      error: 'A user account with the same email already exists',
    });
  } else {
    next();
  }
};

export default preventUserDuplicate;
