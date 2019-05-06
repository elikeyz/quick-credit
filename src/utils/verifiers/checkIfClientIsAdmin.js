const checkIfClientIsAdmin = (req, res, next) => {
  if (req.client.isAdmin) {
    res.status(403).send({
      status: 403,
      error: 'You are not authorized to view the user details of an admin account',
    });
  } else {
    next();
  }
};

export default checkIfClientIsAdmin;
