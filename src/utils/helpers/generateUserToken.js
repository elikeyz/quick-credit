import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateUserToken = user => jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 86400 });

export default generateUserToken;
