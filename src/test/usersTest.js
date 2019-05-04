/* eslint-env mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

should();
chai.use(chaiHttp);

describe('Auth/Users', () => {
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

    it('it should fail if email is not defined', (done) => {
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

    it('it should fail if first name is not defined', (done) => {
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

    it('it should fail if last name is not defined', (done) => {
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

    it('it should fail if home address is not defined', (done) => {
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

    it('it should fail if work address is not defined', (done) => {
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

  describe('POST /auth/signin', () => {
    it('it should fail if the email is not provided', (done) => {
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

    it('it should fail if the email is not defined', (done) => {
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

    it('it should fail if the password is not provided', (done) => {
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

    it('it should fail if the email is not correct', (done) => {
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

    it('it should fail if the password is not correct', (done) => {
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

    it('it should login the user successfully', (done) => {
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

  describe('PATCH /users/:userEmail/verify', () => {
    it('it should fail if the client does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/users/kay1.kom@gmail.com/verify')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Client does not exist');
          done();
        });
    });

    it('it should verify a client successfully', (done) => {
      chai.request(app)
        .patch('/api/v1/users/hansolo25@gmail.com/verify')
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
