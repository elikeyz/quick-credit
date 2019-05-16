import sendErrorResponse from '../helpers/sendErrorResponse';

const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    sendErrorResponse(res, 403, 'This route is for Admin users only');
  } else {
    next();
  }
};

export default adminAuth;
