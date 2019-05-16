import sendErrorResponse from '../helpers/sendErrorResponse';

const userAuth = (req, res, next) => {
  if (!req.user.isAdmin && req.user.email !== req.loan.user) {
    sendErrorResponse(res, 403, 'You are not authorized to visit this route');
  } else {
    next();
  }
};

export default userAuth;
