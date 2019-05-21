import express from 'express';
import authRouter from './authRoutes';
import usersRouter from './usersRoutes';
import loansRouter from './loansRoutes';

const router = express.Router();

router.use(authRouter);
router.use(usersRouter);
router.use(loansRouter);

export default router;
