/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import generateUserToken from '../utils/helpers/generateUserToken';

should();
chai.use(chaiHttp);

describe('Loans', () => {
  describe('GET /loans/:loanId', () => {
    it('it should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('it should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1')
        .set({ token: 'lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should fail if anyone except the Admin or the loan requester tries to access the route', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You are not authorized to visit this route');
          done();
        });
    });

    it('it should get a loan successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
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
    it('it should fail if there is no token in the header', (done) => {
      chai.request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('it should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/loans')
        .set({ token: 'lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('it should fail if the user is not an Admin', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('it should fail if an invalid value is passed to the status query', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the status query are \'approved\', \'rejected\' and \'pending\'');
          done();
        });
    });

    it('it should fail if an invalid value is passed to the repaid query', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the repaid query are \'true\' and \'false\'');
          done();
        });
    });

    it('it should get all the approved loan applications successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the rejected loan applications and unrepaid loans successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the current loans successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the repaid loans successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the loans successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /loans', () => {
    it('it should fail if there is no token in the header', (done) => {
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

    it('it should fail if the token in the header is invalid', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ token: 'lskjdlksjdflk' })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('it should fail if loan purpose is not defined', (done) => {
      const loanData = {
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the purpose of loan request');
          done();
        });
    });

    it('it should fail if loan purpose is not specified', (done) => {
      const loanData = {
        purpose: '',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the purpose of loan request');
          done();
        });
    });

    it('it should fail if loan amount is not defined', (done) => {
      const loanData = {
        purpose: 'Business capital',
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the loan amount requested');
          done();
        });
    });

    it('it should fail if tenor is not defined', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the number of months in the tenor period');
          done();
        });
    });

    it('it should fail if the loan amount specified is not a valid number', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 'sdkfl-=2',
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The loan amount specified must be a valid number');
          done();
        });
    });

    it('it should fail if the loan amount specified is less than or equal to 0', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 0,
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The loan amount specified must be greater than 0');
          done();
        });
    });

    it('it should fail if the tenor specified is not a valid number', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 'sdsjdf',
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The tenor specified must be an integer');
          done();
        });
    });

    it('it should fail if the tenor specified is greater than 12', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 234,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The tenor specified must be in the range of 1 to 12');
          done();
        });
    });

    it('it should fail if the tenor specified is less than 1', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 0,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The tenor specified must be in the range of 1 to 12');
          done();
        });
    });

    it('it should fail if the specified email belongs to an admin account', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
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
        .post('/api/v1/loans')
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You cannot apply for a loan with an admin account');
          done();
        });
    });

    it('it should fail if the client info has not been verified', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: 6,
        email: 'carljohnson25@gmail.com',
        firstName: 'Carl',
        lastName: 'Johnson',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'unverified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You cannot apply for a loan until your user details are verified');
          done();
        });
    });

    it('it should fail if the client has an outstanding loan', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: 2,
        email: 'johndoe25@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'johndoe25',
        address: 'No. 123, Acme Drive, Wakanda District',
        workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
        status: 'verified',
        isAdmin: false,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('You cannot apply for more than one loan at a time');
          done();
        });
    });

    it('it should create a new loan successfully', (done) => {
      const loanData = {
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };
      const user = {
        id: 4,
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('user').eql('nikobellic25@gmail.com');
          res.body.data.should.have.property('amount').eql(10000);
          res.body.data.should.have.property('tenor').eql(3);
          done();
        });
    });
  });

  describe('PATCH /loans/:loanId', () => {
    it('it should fail if there is no token in the header', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('You did not enter a token in the header');
          done();
        });
    });

    it('it should fail if the token in the header is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .set({ token: 'lskjdlksjdflk' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Failed to authenticate token');
          done();
        });
    });

    it('it should fail if the user is not an Admin', (done) => {
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
        .set({ token: generateUserToken(user) })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('This route is for Admin users only');
          done();
        });
    });

    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should fail if the status is not defined', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('it should fail if the status is not specified', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({ status: '' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('it should fail if the status passed in the body is neither \'approved\' nor \'rejected\'', (done) => {
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
        .set({ token: generateUserToken(user) })
        .type('form')
        .send({ status: 'pending' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only acceptable values for status are \'approved\' or \'rejected\'');
          done();
        });
    });

    it('it should approve the loan application successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
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

    it('it should reject the loan application successfully', (done) => {
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
        .set({ token: generateUserToken(user) })
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
