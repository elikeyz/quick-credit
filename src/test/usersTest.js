import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('/GET /', () => {
  it('it should load the base URL successfully', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('message').eql('Welcome to Quick Credit API Version 1. Written by Elijah Enuem-Udogu');
        done();
      });
  });
});

describe('POST /auth/signup', () => {
  it('it should fail if email is not specified', (done) => {
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
        res.body.should.have.property('error').eql('You did not enter the email');
        done();
      });
  });

  it('it should fail if first name is not specified', (done) => {
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

  it('it should fail if last name is not specified', (done) => {
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

  it('it should fail if password is not specified', (done) => {
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
        res.body.should.have.property('error').eql('You did not enter the password');
        done();
      });
  });

  it('it should fail if home address is not specified', (done) => {
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

  it('it should fail if work address is not specified', (done) => {
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

  it('it should fail if the email address specified does not follow the right pattern', (done) => {
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

  it('it should fail if a user account with the same email address already exists', (done) => {
    const user = {
      email: 'johndoe25@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'johndoe25',
      address: 'No. 123, Acme Drive, Wakanda District',
      workAddress: 'No. 456, Foobar Avenue, Vibranium Valley',
    };

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

  it('it should signup the user successfully', (done) => {
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
