/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../app';
import generateUserToken from '../utils/helpers/generateUserToken';
import dbconnect from '../utils/helpers/dbconnect';

should();
chai.use(chaiHttp);

describe('Repayments', () => {
  beforeEach((done) => {
    dbconnect.query(`
      DROP TABLE repayments;
      DROP TABLE loans;
      DROP TABLE users;
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        firstName TEXT,
        lastName TEXT,
        password TEXT,
        address TEXT,
        workAddress TEXT,
        status TEXT,
        isAdmin BOOLEAN
    );
    CREATE TABLE loans(
        id SERIAL PRIMARY KEY,
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
    CREATE TABLE repayments(
        id SERIAL PRIMARY KEY,
        createdOn TIMESTAMPTZ,
        loanId INT REFERENCES loans(id),
        amount FLOAT,
        monthlyInstallment FLOAT,
        paidAmount FLOAT,
        balance FLOAT
    );
    `).then(() => {
      const hashedPassword = bcrypt.hashSync('quickcredit2019', 10);
      const text = 'INSERT INTO users(email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = ['quickcredit2019@gmail.com', 'Quick', 'Credit', hashedPassword, 'No. 123, Acme Drive, Wakanda District', 'No. 456, Foobar Avenue, Vibranium Valley', 'verified', true];
      dbconnect.query(text, values).then(() => {
        done();
      });
    });
  });

  describe('GET /loans/:loanId/repayments', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/loans/2/repayments')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/loans/2/repayments')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should fail if a non-numerical character is provided as the Loan ID', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get('/api/v1/loans/a/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('should fail if a floating point number is provided as the Loan ID', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get('/api/v1/loans/1.1/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('should fail if the loan does not exist', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get('/api/v1/loans/50/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('should fail if anyone except the Admin or the loan requester tries to access the route', (done) => {
      const user = {
        id: 3,
        email: 'janedoe25@gmail.com',
        firstName: 'Jane',
        lastName: 'Doe',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };
      chai.request(app)
        .get('/api/v1/loans/1')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You are not authorized to visit this route');
          done();
        });
    });

    it('should get all the repayments made to the specified loan successfully', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get('/api/v1/loans/1/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /loans/:loanId/repayments', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should fail if the user is not an Admin', (done) => {
      const user = {
        id: 2,
        email: 'johndoe25@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('should fail if a non-numerical character is provided as the Loan ID', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/a/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('should fail if a floating point number is provided as the Loan ID', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/1.1/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('should fail if the loan does not exist', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/50/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('should fail if the paid amount is not defined', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the paid amount');
          done();
        });
    });

    it('should fail if the paid amount specified is not a valid number', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 'sdlfjs' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The paid amount specified must be a valid number');
          done();
        });
    });

    it('should fail if the loan specified has been fully repaid', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/1/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The loan specified has been fully repaid');
          done();
        });
    });

    it('should fail if the paid amount does not equal the loan balance when the loan balance is less than the monthly installment', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/5/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must equal the loan debt balance of 4500 since the loan debt balance is less than the monthly installment of 5250');
          done();
        });
    });

    it('should fail if the paid amount is less than the monthly installment', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 5000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must not be less than the monthly installment of 8750');
          done();
        });
    });

    it('should fail if the paid amount exceeds the loan balance', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 100000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must not exceed the loan debt balance of 73750');
          done();
        });
    });

    it('should post a loan repayment successfully', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('monthlyInstallment').eql(8750);
          res.body.data.should.have.property('paidAmount').eql(9000);
          res.body.data.should.have.property('balance').eql(64750);
          done();
        });
    });

    it('should mark a loan as repaid if the balance is cleared', (done) => {
      const user = {
        id: 1,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/5/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 4500 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('monthlyInstallment').eql(5250);
          res.body.data.should.have.property('paidAmount').eql(4500);
          res.body.data.should.have.property('balance').eql(0);
          done();
        });
    });
  });
});
