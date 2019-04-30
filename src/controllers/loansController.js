const getALoan = (req, res) => {
  res.status(200).send({
    status: 200,
    data: req.loan,
  });
};

const loansController = {
  getALoan,
};

export default loansController;
