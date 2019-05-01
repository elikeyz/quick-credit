import repayments from '../models/repayments';

const getLoanRepayments = (req, res) => {
  const loanRepayments = repayments.filter(repayment => repayment.loanId
                                           === parseInt(req.params.loanId, 10));
  res.status(200).send({
    status: 200,
    data: loanRepayments,
  });
};

const repaymentsController = {
  getLoanRepayments,
};

export default repaymentsController;
