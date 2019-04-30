import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('GET /loans/:loanId', () => {
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
