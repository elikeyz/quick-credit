import dbconnect from '../utils/helpers/dbconnect';

const createTables = () => {
  dbconnect.query(`
    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY,
        email TEXT UNIQUE,
        firstName TEXT,
        lastName TEXT,
        password TEXT,
        address TEXT,
        workAddress TEXT,
        status TEXT,
        isAdmin BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS loans(
        id UUID PRIMARY KEY,
        client TEXT REFERENCES users(email),
        firstName TEXT,
        lastName TEXT,
        createdOn TIMESTAMPTZ,
        updatedOn TIMESTAMPTZ,
        purpose TEXT,
        status TEXT,
        repaid BOOLEAN,
        tenor INT,
        amount FLOAT,
        paymentInstallment FLOAT,
        balance FLOAT,
        interest FLOAT
    );
    CREATE TABLE IF NOT EXISTS repayments(
        id UUID PRIMARY KEY,
        createdOn TIMESTAMPTZ,
        loanId UUID REFERENCES loans(id),
        amount FLOAT,
        monthlyInstallment FLOAT,
        paidAmount FLOAT,
        balance FLOAT
    );
  `);
};

export default createTables;
