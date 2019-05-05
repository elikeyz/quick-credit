import users from '../../models/users';
import loans from '../../models/loans';

const loanVerify = (req, res, next) => {
  const userMatch = users.filter(user => user.email === req.body.user);
  if (userMatch.length < 1) {
    res.status(404).send({
      status: 404,
      error: 'Client does not exist',
    });
  } else if (userMatch[0].isAdmin) {
    res.status(403).send({
      status: 403,
      error: 'You cannot apply for a loan with an admin account',
    });
  } else if (userMatch[0].status !== 'verified') {
    res.status(403).send({
      status: 403,
      error: 'You cannot apply for a loan until your user details are verified',
    });
  } else {
    const unpaidLoans = loans.filter(loan => loan.user === req.body.user && !loan.repaid);
    if (unpaidLoans.length > 0) {
      res.status(403).send({
        status: 403,
        error: 'You cannot apply for more than one loan at a time',
      });
    } else {
      const [user] = userMatch;
      req.user = user;
      next();
    }
  }
};

export default loanVerify;
