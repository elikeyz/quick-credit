const loanResponseValidate = (req, res, next) => {
  if (!req.body.status || !req.body.status.trim()) {
    res.status(400).send({
      status: 400,
      error: 'You did not specify the status',
    });
  } else if (req.body.status !== 'approved' && req.body.status !== 'rejected') {
    res.status(400).send({
      status: 400,
      error: 'The only acceptable values for status are \'approved\' or \'rejected\'',
    });
  } else {
    next();
  }
};

export default loanResponseValidate;
