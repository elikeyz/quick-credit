import dbconnect from '../helpers/dbconnect';

const filterMyLoans = (req, res, next) => {
  const text = 'SELECT * FROM loans WHERE client = $1';
  const values = [req.user.email];
  dbconnect.query(text, values).then((result) => {
    req.myLoans = result.rows;
    next();
  });
};

export default filterMyLoans;
