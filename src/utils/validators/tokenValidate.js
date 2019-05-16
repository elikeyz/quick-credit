import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendErrorResponse from '../helpers/sendErrorResponse';

dotenv.config();

const tokenValidate = (req, res, next) => {
  if (!req.headers.token || !req.headers.token.trim()) {
    sendErrorResponse(res, 401, 'You did not enter a token in the header');
  } else {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        sendErrorResponse(res, 401, 'Failed to authenticate token');
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

export default tokenValidate;
