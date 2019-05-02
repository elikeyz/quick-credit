const loanValidate2 = (req, res, next) => {
  if (Number.isNaN(Number(req.body.amount))) {
    res.status(400).send({
      status: 400,
      error: 'The loan amount specified must be a valid number',
    });
  } else if (Number.isNaN(parseInt(req.body.tenor, 10))) {
    res.status(400).send({
      status: 400,
      error: 'The tenor specified must be an integer',
    });
  } else if (Number(req.body.amount) <= 0) {
    res.status(400).send({
      status: 400,
      error: 'The loan amount specified must be greater than 0',
    });
  } else if (parseInt(req.body.tenor, 10) < 1 || parseInt(req.body.tenor, 10) > 12) {
    res.status(400).send({
      status: 400,
      error: 'The tenor specified must be in the range of 1 to 12',
    });
  } else {
    next();
  }
};

export default loanValidate2;
