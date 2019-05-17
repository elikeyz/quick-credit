import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendErrorResponse from '../helpers/sendErrorResponse';

dotenv.config();

const tokenValidate = (req, res, next) => {
  if (!req.headers.authorization) {
    sendErrorResponse(res, 401, 'You did not enter a token in the header');
  } else {
    const bearer = req.headers.authorization.split(' ');
    const [, token] = bearer;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
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
