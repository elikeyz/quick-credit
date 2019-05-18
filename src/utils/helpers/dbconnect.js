import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  test: {
    connectionString: process.env.TEST_DATABASE_URL,
    ssl: true,
  },
  development: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
};

const dbconnect = new Pool(config[process.env.NODE_ENV]);

export default dbconnect;
