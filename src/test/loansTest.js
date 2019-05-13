/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('Loans', () => {
  describe('GET /loans/:loanId', () => {
    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
      chai.request(app)
        .get('/api/v1/loans/a')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1.1')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/loans/50')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should get a loan successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1')
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
    it('it should fail if an invalid value is passed to the status query', (done) => {
      chai.request(app)
        .get('/api/v1/loans?status=approv')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the status query are \'approved\', \'rejected\' and \'pending\'');
          done();
        });
    });

    it('it should fail if an invalid value is passed to the repaid query', (done) => {
      chai.request(app)
        .get('/api/v1/loans?repaid=fal')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only valid values for the repaid query are \'true\' and \'false\'');
          done();
        });
    });

    it('it should get all the approved loan applications successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans?status=approved')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the rejected loan applications and unrepaid loans successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans?repaid=false')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the current loans successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans?status=approved&repaid=false')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the repaid loans successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans?status=approved&repaid=true')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('it should get all the loans successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /loans', () => {
    it('it should fail if user email is not defined', (done) => {
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
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the user email');
          done();
        });
    });

    it('it should fail if user email is not specified', (done) => {
      const loanData = {
        user: '',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the user email');
          done();
        });
    });

    it('it should fail if loan purpose is not defined', (done) => {
      const loanData = {
        user: 'nikobellic25@gmail.com',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: '',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 'sdkfl-=2',
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 0,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 'sdsjdf',
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 234,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 0,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The tenor specified must be in the range of 1 to 12');
          done();
        });
    });

    it('it should fail if the client does not exist', (done) => {
      const loanData = {
        user: 'unknownclient@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
        .type('form')
        .send(loanData)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Client does not exist');
          done();
        });
    });

    it('it should fail if the specified email belongs to an admin account', (done) => {
      const loanData = {
        user: 'quickcredit2019@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'hansolo25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'johndoe25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
        user: 'nikobellic25@gmail.com',
        purpose: 'Business capital',
        amount: 10000,
        tenor: 3,
      };

      chai.request(app)
        .post('/api/v1/loans')
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
    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/a')
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/1.1')
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/50')
        .type('form')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should fail if the status is not defined', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .type('form')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('it should fail if the status is not specified', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .type('form')
        .send({ status: '' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the status');
          done();
        });
    });

    it('it should fail if the status passed in the body is neither \'approved\' nor \'rejected\'', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
        .type('form')
        .send({ status: 'pending' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The only acceptable values for status are \'approved\' or \'rejected\'');
          done();
        });
    });

    it('it should approve the loan application successfully', (done) => {
      chai.request(app)
        .patch('/api/v1/loans/3')
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
      chai.request(app)
        .patch('/api/v1/loans/3')
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
