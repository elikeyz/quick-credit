import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

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
