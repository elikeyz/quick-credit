/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../app';
import generateUserToken from '../utils/helpers/generateUserToken';
import dbconnect from '../utils/helpers/dbconnect';

should();
chai.use(chaiHttp);


describe('/GET /', () => {
  it('should load the base URL successfully', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('message').eql('Welcome to Quick Credit API Version 1. Navigate to /api-docs for the API Documentation. Written by Elijah Enuem-Udogu');
        done();
      });
  });
});

describe('/ALL *', () => {
  it('should fail if the route does not exist', (done) => {
    chai.request(app)
      .get('/unknown')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').eql('This route is not available');
        done();
      });
  });
});

describe('Auth/Users', () => {
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

  describe('POST /auth/signup', () => {
    it('should fail if email is not specified', (done) => {
      const user = {
        email: '',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your email');
          done();
        });
    });

    it('should fail if email is not defined', (done) => {
      const user = {
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your email');
          done();
        });
    });

    it('should fail if password is not specified', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: '',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your password');
          done();
        });
    });

    it('should fail if first name is not specified', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: '',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the first name');
          done();
        });
    });

    it('should fail if first name is not defined', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the first name');
          done();
        });
    });

    it('should fail if last name is not specified', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: '',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the last name');
          done();
        });
    });

    it('should fail if last name is not defined', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the last name');
          done();
        });
    });

    it('should fail if home address is not specified', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: '',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the home address');
          done();
        });
    });

    it('should fail if home address is not defined', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the home address');
          done();
        });
    });

    it('should fail if work address is not specified', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: '',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the work address');
          done();
        });
    });

    it('should fail if work address is not defined', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter the work address');
          done();
        });
    });

    it('should fail if the email address specified does not follow the right pattern', (done) => {
      const user = {
        email: 'koppter',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('Your email address must follow the pattern ****@**.**');
          done();
        });
    });

    it('should fail if the password specified contains whitespaces', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'masta hacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You must not add whitespaces in your password');
          done();
        });
    });

    it('should fail if a user account with the same email address already exists', (done) => {
      const user = {
        email: 'johndoe25@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'johndoe25',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
      };
      const {
        email, firstName, lastName, password, address, workAddress,
      } = user;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const text = 'INSERT INTO users(email, firstName, lastName, password, address, workAddress, status, isAdmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [email, firstName, lastName, hashedPassword, address, workAddress, 'unverified', false];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .type('form')
          .send(user)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.have.property('error').eql('A user account with the same email already exists');
            done();
          });
      });
    });

    it('should signup the user successfully', (done) => {
      const user = {
        email: 'koppter.kom@gmail.com',
        firstName: 'Elijah',
        lastName: 'Enuem-Udogu',
        password: 'mastahacka',
        address: 'No. 11, Elaiho Lane.',
        workAddress: 'Shopping Complex, EDPA.',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('email').eql('koppter.kom@gmail.com');
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should fail if the email is not provided', (done) => {
      const userData = {
        email: '',
        password: 'johndoe25',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your email');
          done();
        });
    });

    it('should fail if the email is not defined', (done) => {
      const userData = {
        password: 'johndoe25',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your email');
          done();
        });
    });

    it('should fail if the password is not provided', (done) => {
      const userData = {
        email: 'johndoe25@gmail.com',
        password: '',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not enter your password');
          done();
        });
    });

    it('should fail if the email is not correct', (done) => {
      const userData = {
        email: 'koppter.kom@gmail.com',
        password: 'johndoe25',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('The email or password you entered is incorrect');
          done();
        });
    });

    it('should fail if the password is not correct', (done) => {
      const userData = {
        email: 'johndoe25@gmail.com',
        password: 'mastahacka',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('The email or password you entered is incorrect');
          done();
        });
    });

    it('should login the user successfully', (done) => {
      const userData = {
        email: 'johndoe25@gmail.com',
        password: 'johndoe25',
      };

      chai.request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('email').eql('johndoe25@gmail.com');
          done();
        });
    });
  });

  describe('GET /users', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/users')
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
        .get('/api/v1/users')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('should get all the client details successfully', (done) => {
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
        .get('/api/v1/users')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /users/me', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/users/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/users/me')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should get the user\'s details successfully', (done) => {
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
        .get('/api/v1/users/me')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('email').eql('quickcredit2019@gmail.com');
          done();
        });
    });
  });

  describe('GET /users/me/loans', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/users/me/loans')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/users/me/loans')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should get the user\'s loans successfully', (done) => {
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
        .get('/api/v1/users/me/loans')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /users/me/repayments', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/users/me/repayments')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/users/me/repayments')
        .set({ authorization: 'Bearer lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('should get the user\'s loan repayments successfully', (done) => {
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
        .get('/api/v1/users/me/repayments')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /users/:userEmail', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/users/johndoe25@gmail.com')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/users/johndoe25@gmail.com')
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
        .get('/api/v1/users/johndoe25@gmail.com')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('should fail if the client does not exist', (done) => {
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
        .get('/api/v1/users/kay1.kom@gmail.com')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Client does not exist');
          done();
        });
    });

    it('should fail if the email specified belongs to an admin account', (done) => {
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
        .get('/api/v1/users/quickcredit2019@gmail.com')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You are not authorized to view the user details of an admin account');
          done();
        });
    });

    it('should get a client\'s user details successfully', (done) => {
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
        .get('/api/v1/users/johndoe25@gmail.com')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('email').eql('johndoe25@gmail.com');
          res.body.data.should.have.property('isAdmin').eql(false);
          done();
        });
    });
  });

  describe('PATCH /users/:userEmail/verify', () => {
    it('should fail if there is no token in the header', (done) => {
      chai.request(app)
        .patch('/api/v1/users/hansolo25@gmail.com/verify')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/users/hansolo25@gmail.com/verify')
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
        .patch('/api/v1/users/hansolo25@gmail.com/verify')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('should fail if the client does not exist', (done) => {
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
        .patch('/api/v1/users/kay1.kom@gmail.com/verify')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Client does not exist');
          done();
        });
    });

    it('should fail if the email specified belongs to an admin account', (done) => {
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
        .patch('/api/v1/users/quickcredit2019@gmail.com/verify')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You are not authorized to view the user details of an admin account');
          done();
        });
    });

    it('should verify a client successfully', (done) => {
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
        .patch('/api/v1/users/hansolo25@gmail.com/verify')
        .set({ authorization: `Bearer ${generateUserToken(user)}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('email').eql('hansolo25@gmail.com');
          res.body.data.should.have.property('status').eql('verified');
          done();
        });
    });
  });
});
