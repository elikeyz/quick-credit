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

describe('Loans', () => {
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

  describe('GET /loans/:loanId', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1')
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
        .get('/api/v1/loans/a')
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
        .get('/api/v1/loans/1.1')
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
        .get('/api/v1/loans/50')
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

    it('should get a loan successfully', (done) => {
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
        .get('/api/v1/loans/1')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').eql(1);
          done();
        });
    });
  });

  describe('GET /loans', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/loans')
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
        .get('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('should fail if an invalid value is passed to the status query', (done) => {
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
        .get('/api/v1/loans?status=approv')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the status query are \'approved\', \'rejected\' and \'pending\'');
          done();
        });
    });

    it('should fail if an invalid value is passed to the repaid query', (done) => {
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
        .get('/api/v1/loans?repaid=fal')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the repaid query are \'true\' and \'false\'');
          done();
        });
    });

    it('should get all the approved loan applications successfully', (done) => {
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
        .get('/api/v1/loans?status=approved')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all the rejected loan applications and unrepaid loans successfully', (done) => {
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
        .get('/api/v1/loans?repaid=false')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all the current loans successfully', (done) => {
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
        .get('/api/v1/loans?status=approved&repaid=false')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all the repaid loans successfully', (done) => {
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
        .get('/api/v1/loans?status=approved&repaid=true')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all the loans successfully', (done) => {
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
        .get('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /loans', () => {
    let verifiedUserId = '';
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
      const text = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const values = [uuidv4(), email, firstName, lastName, hashedPassword, address, workAddress, 'verified', false];
      dbconnect.query(text, values).then((result) => {
        verifiedUserId = result.rows[0].id;
        done();
      });
    });

    it('should fail if there is no token in the header', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should fail if loan purpose is not defined', (done) => {
      const loanData = {
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the purpose of loan request');
          done();
        });
    });

    it('should fail if loan purpose is not specified', (done) => {
      const loanData = {
        purpose: '',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the purpose of loan request');
          done();
        });
    });

    it('should fail if loan amount is not defined', (done) => {
      const loanData = {
        purpose: 'Business capital',
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the loan amount requested');
          done();
        });
    });

    it('should fail if tenor is not defined', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the number of months in the tenor period');
          done();
        });
    });

    it('should fail if the loan amount specified is not a valid number', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 'sdkfl-=2',
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The loan amount specified must be a valid number');
          done();
        });
    });

    it('should fail if the loan amount specified is less than or equal to 0', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 0,
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql('The loan amount specified must be greater than 0');
          done();
        });
    });

    it('should fail if the tenor specified is not a valid number', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 'sdsjdf',
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The tenor specified must be an integer');
          done();
        });
    });

    it('should fail if the tenor specified is greater than 12', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 234,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql('The tenor specified must be in the range of 1 to 12');
          done();
        });
    });

    it('should fail if the tenor specified is less than 1', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 0,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql('The tenor specified must be in the range of 1 to 12');
          done();
        });
    });

    it('should fail if the specified email belongs to an admin account', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
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
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You cannot apply for a loan with an admin account');
          done();
        });
    });

    it('should fail if the client info has not been verified', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const hashedPassword = bcrypt.hashSync('carljohnson25', 10);
      const user = {
        id: uuidv4(),
        email: 'carljohnson25@gmail.com',
        firstName: 'Carl',
        lastName: 'Johnson',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'unverified',
        isAdmin: false,
      };
      const text = 'INSERT INTO users(id, email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        hashedPassword,
        user.address,
        user.workAddress,
        user.status,
        user.isAdmin];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/loans')
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send(loanData)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('You cannot apply for a loan until your user details are verified');
            done();
          });
      });
    });

    it('should fail if the client has an outstanding loan', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        password: 'nikobellic25',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };
      const text = 'INSERT INTO loans(id, client, firstName, lastName, createdOn, updatedOn, purpose, status, repaid, tenor, amount, paymentInstallment, balance, interest) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
      const values = [
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
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/loans')
          .set({ authorization: `Bearer ${generateUserToken(user)}` })
          .type('form')
          .send(loanData)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('error').eql('You cannot apply for more than one loan at a time');
            done();
          });
      });
    });

    it('should create a new loan successfully', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: verifiedUserId,
        email: 'nikobellic25@gmail.com',
        firstName: 'Niko',
        lastName: 'Bellic',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('client').eql('nikobellic25@gmail.com');
          res.body.data.should.have.property('amount').eql(10000);
          res.body.data.should.have.property('tenor').eql(3);
          done();
        });
    });
  });

  describe('PATCH /loans/:loanId', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
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
        .patch('/api/v1/loans/3')
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
        .patch('/api/v1/loans/a')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'approved' })
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
        .patch('/api/v1/loans/1.1')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'approved' })
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
        .patch('/api/v1/loans/50')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('should fail if the status is not defined', (done) => {
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
        .patch('/api/v1/loans/3')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('should fail if the status is not specified', (done) => {
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
        .patch('/api/v1/loans/3')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: '' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('should fail if the status passed in the body is neither \'approved\' nor \'rejected\'', (done) => {
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
        .patch('/api/v1/loans/3')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'pending' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only acceptable values for status are \'approved\' or \'rejected\'');
          done();
        });
    });

    it('should approve the loan application successfully', (done) => {
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
        .patch('/api/v1/loans/3')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').eql(3);
          res.body.data.should.have.property('status').eql('approved');
          done();
        });
    });

    it('should reject the loan application successfully', (done) => {
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
        .patch('/api/v1/loans/3')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .type('form')
        .send({ status: 'rejected' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').eql(3);
          res.body.data.should.have.property('status').eql('rejected');
          done();
        });
    });
  });
});
