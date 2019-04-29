import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('/GET /', () => {
  it('it should load the base URL successfully', () => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').eql('Welcome to Quick Credit API Version 1. Written by Elijah Enuem-Udogu');
      });
  });
});
