import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

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
