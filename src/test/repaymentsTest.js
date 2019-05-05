/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('Repayments', () => {
  describe('GET /loans/:loanId/repayments', () => {
    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
      chai.request(app)
        .get('/api/v1/loans/a/repayments')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1.1/repayments')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/loans/50/repayments')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should get all the repayments made to the specified loan successfully', (done) => {
      chai.request(app)
        .get('/api/v1/loans/1/repayments')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /loans/:loanId/repayments', () => {
    it('it should fail if a non-numerical character is provided as the Loan ID', (done) => {
      chai.request(app)
        .post('/api/v1/loans/a/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if a floating point number is provided as the Loan ID', (done) => {
      chai.request(app)
        .post('/api/v1/loans/1.1/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The Loan ID parameter must be an integer');
          done();
        });
    });

    it('it should fail if the loan does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/loans/50/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('The loan specified does not exist');
          done();
        });
    });

    it('it should fail if the paid amount is not defined', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the paid amount');
          done();
        });
    });

    it('it should fail if the paid amount is not specified', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({ paidAmount: '' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('You did not specify the paid amount');
          done();
        });
    });

    it('it should fail if the paid amount specified is not a valid number', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({ paidAmount: 'sdlfjs' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('The paid amount specified must be a valid number');
          done();
        });
    });

    it('it should fail if the loan specified has been fully repaid', (done) => {
      chai.request(app)
        .post('/api/v1/loans/1/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The loan specified has been fully repaid');
          done();
        });
    });

    it('it should fail if the paid amount does not equal the loan balance when the loan balance is less than the monthly installment', (done) => {
      chai.request(app)
        .post('/api/v1/loans/5/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must equal the loan debt balance of 4500 since the loan debt balance is less than the monthly installment of 5250');
          done();
        });
    });

    it('it should fail if the paid amount is less than the monthly installment', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({ paidAmount: 5000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must not be less than the monthly installment of 8750');
          done();
        });
    });

    it('it should fail if the paid amount exceeds the loan balance', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({ paidAmount: 100000 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error').eql('The paid amount must not exceed the loan debt balance of 73750');
          done();
        });
    });

    it('it should post a loan repayment successfully', (done) => {
      chai.request(app)
        .post('/api/v1/loans/2/repayments')
        .type('form')
        .send({ paidAmount: 9000 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('monthlyInstallment').eql(8750);
          res.body.data.should.have.property('paidAmount').eql(9000);
          res.body.data.should.have.property('balance').eql(64750);
          done();
        });
    });

    it('it should mark a loan as repaid if the balance is cleared', (done) => {
      chai.request(app)
        .post('/api/v1/loans/5/repayments')
        .type('form')
        .send({ paidAmount: 4500 })
        .end((err, res) => {
          res.should.have.status(200);
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
