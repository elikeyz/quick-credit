/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import uuidv4 from 'uuid/v4';
import app from '../app';
import generateUserToken from '../utils/helpers/generateUserToken';
import dbconnect from '../utils/helpers/dbconnect';

should();
chai.use(chaiHttp);

describe('Repayments', () => {
  let adminId = '';
  beforeEach((done) => {
    dbconnect.query(`
      DROP TABLE repayments;
      DROP TABLE loans;
      DROP TABLE users;
      CREATE TABLE users(
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
    CREATE TABLE loans(
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
    CREATE TABLE repayments(
        id UUID PRIMARY KEY,
        createdOn TIMESTAMPTZ,
        loanId UUID REFERENCES loans(id),
        amount FLOAT,
        monthlyInstallment FLOAT,
        paidAmount FLOAT,
        balance FLOAT
    );
    `).then(() => {
      const hashedPassword = bcrypt.hashSync('quickcredit2019', 10);
      const text = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const values = [uuidv4(), 'quickcredit2019@gmail.com', 'Quick', 'Credit', hashedPassword, 'No. 123, Acme Drive, Wakanda District', 'No. 456, Foobar Avenue, Vibranium Valley', 'verified', true];
      dbconnect.query(text, values).then((result) => {
        adminId = result.rows[0].id;
        done();
      });
    });
  });

  describe('GET /loans/:loanId/repayments', () => {
    let loanId = '';
    beforeEach((done) => {
      const user = {
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        password: 'nikobellic25',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
      };
      const {
        email, firstName, lastName, password, address, workAddress,
      } = user;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userText = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const userValues = [uuidv4(), email, firstName, lastName, hashedPassword, address, workAddress, 'verified', false];
      dbconnect.query(userText, userValues).then(() => {
        const loanText = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
        const loanValues = [
          uuidv4(),
          user.email,
          user.firstName,
          user.lastName,
          new Date(),
          new Date(),
          'Business purposes',
          'approved',
          false,
          10,
          100000,
          10500,
          105000,
          5000,
        ];
        dbconnect.query(loanText, loanValues).then((result) => {
          loanId = result.rows[0].id;
          done();
        });
      });
    });

    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get(`/api/v1/loans/${loanId}/repayments`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should fail if the loan ID specified is not a valid UUID', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get('/api/v1/loans/sdfksdfljsdjfls/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID specified is not a valid UUID');
          done();
        });
    });

    it('should fail if the loan ID specified is not a valid UUID', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get(`/api/v1/loans/${uuidv4()}khjgjg/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID specified is not a valid UUID');
          done();
        });
    });

    it('should fail if the loan does not exist', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get(`/api/v1/loans/${uuidv4()}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('should fail if anyone except the Admin or the loan requester tries to access the route', (done) => {
      const hashedPassword = bcrypt.hashSync('johndoe25', 10);
      const user = {
        id: uuidv4(),
        email: 'johndoe25@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };
      const text = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [user.id, user.email, user.firstName, user.lastName, hashedPassword, user.address, user.workAddress, 'verified', false];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .get(`/api/v1/loans/${loanId}/repayments`)
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('You are not authorized to visit this route');
            done();
          });
      });
    });

    it('should get all the repayments made to the specified loan successfully', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .get(`/api/v1/loans/${loanId}/repayments`)
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
    let loanId = '';
    beforeEach((done) => {
      const user = {
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        password: 'nikobellic25',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
      };
      const {
        email, firstName, lastName, password, address, workAddress,
      } = user;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userText = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const userValues = [uuidv4(), email, firstName, lastName, hashedPassword, address, workAddress, 'verified', false];
      dbconnect.query(userText, userValues).then(() => {
        const loanText = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
        const loanValues = [
          uuidv4(),
          user.email,
          user.firstName,
          user.lastName,
          new Date(),
          new Date(),
          'Business purposes',
          'approved',
          false,
          10,
          100000,
          10500,
          105000,
          5000,
        ];
        dbconnect.query(loanText, loanValues).then((result) => {
          loanId = result.rows[0].id;
          done();
        });
      });
    });

    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should fail if the user is not an Admin', (done) => {
      const hashedPassword = bcrypt.hashSync('johndoe25', 10);
      const user = {
        id: uuidv4(),
        email: 'johndoe25@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };
      const text = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [user.id, user.email, user.firstName, user.lastName, hashedPassword, user.address, user.workAddress, 'verified', false];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post(`/api/v1/loans/${loanId}/repayments`)
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send({ paidAmount: 12000 })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('This route is for Admin users only');
            done();
          });
      });
    });

    it('should fail if the loan ID specified is not a valid UUID', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/loans/sdfksdfljsdjfls/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID specified is not a valid UUID');
          done();
        });
    });

    it('should fail if the loan ID specified is not a valid UUID', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${uuidv4()}khjgjg/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID specified is not a valid UUID');
          done();
        });
    });

    it('should fail if the loan does not exist', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${uuidv4()}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('should fail if the specified loan has not been approved', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      const loanText = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
      const loanValues = [
        uuidv4(),
        user.email,
        user.firstName,
        user.lastName,
        new Date(),
        new Date(),
        'Business purposes',
        'pending',
        false,
        10,
        100000,
        10500,
        105000,
        5000,
      ];
      dbconnect.query(loanText, loanValues).then((result) => {
        chai.request(app)
          .post(`/api/v1/loans/${result.rows[0].id}/repayments`)
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send({ paidAmount: 12000 })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('This loan application has not been approved');
            done();
          });
      });
    });

    it('should fail if the paid amount is not defined', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
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
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
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
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      const loanText = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
      const loanValues = [
        uuidv4(),
        user.email,
        user.firstName,
        user.lastName,
        new Date(),
        new Date(),
        'Business purposes',
        'approved',
        true,
        10,
        100000,
        10500,
        0,
        5000,
      ];
      dbconnect.query(loanText, loanValues).then((result) => {
        chai.request(app)
          .post(`/api/v1/loans/${result.rows[0].id}/repayments`)
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send({ paidAmount: 12000 })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('The loan specified has been fully repaid');
            done();
          });
      });
    });

    it('should fail if the paid amount does not equal the loan balance when the loan balance is less than the monthly installment', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      const loanText = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
      const loanValues = [
        uuidv4(),
        user.email,
        user.firstName,
        user.lastName,
        new Date(),
        new Date(),
        'Business purposes',
        'approved',
        false,
        10,
        100000,
        10500,
        6000,
        5000,
      ];
      dbconnect.query(loanText, loanValues).then((result) => {
        chai.request(app)
          .post(`/api/v1/loans/${result.rows[0].id}/repayments`)
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send({ paidAmount: 12000 })
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('error').eql('The paid amount must equal the loan debt balance of 6000 since the loan debt balance is less than the monthly installment of 10500');
            done();
          });
      });
    });

    it('should fail if the paid amount is less than the monthly installment', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 5000 })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql('The paid amount must not be less than the monthly installment of 10500');
          done();
        });
    });

    it('should fail if the paid amount exceeds the loan balance', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 1000000 })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql('The paid amount must not exceed the loan debt balance of 105000');
          done();
        });
    });

    it('should post a loan repayment successfully', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 12000 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('monthlyinstallment').eql(10500);
          res.body.data.should.have.property('paidamount').eql(12000);
          res.body.data.should.have.property('balance').eql(93000);
          done();
        });
    });

    it('should mark a loan as repaid if the balance is cleared', (done) => {
      const user = {
        id: adminId,
        email: 'quickcredit2019@gmail.com',
        firstName: 'Quick',
        lastName: 'Credit',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: true,
      };
      chai.request(app)
        .post(`/api/v1/loans/${loanId}/repayments`)
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ paidAmount: 105000 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('monthlyinstallment').eql(10500);
          res.body.data.should.have.property('paidamount').eql(105000);
          res.body.data.should.have.property('balance').eql(0);
          done();
        });
    });
  });
});
