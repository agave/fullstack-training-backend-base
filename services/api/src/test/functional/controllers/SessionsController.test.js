const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const API = require('../helpers/api');
const validate = require('../helpers/validate');

const errorCodes = require('../../../config/error-codes');
const fixtures = require('../fixtures/session');

const sessionSchema = require('../schemas/session');
const successSchema = require('../schemas/success');
const errorSchema = require('../schemas/error');

chai.should();
chai.use(chaiAsPromised);

describe('functional/Session tests', function() {

  describe('login', function() {

    it('should return error if email is not present', function() {
      const withoutEmail = fixtures.withoutEmail();

      return API.login(withoutEmail)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return error if password is not present', function() {
      const withoutPassword = fixtures.withoutPassword();

      return API.login(withoutPassword)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return not found if user does not exists', function() {
      const invalidCredential = fixtures.invalidCredential();

      return API.login(invalidCredential)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        responseData.error.code.should.be.eql(errorCodes.Session[responseData.error.message]);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return not found if password is wrong', function() {
      const invalidCredential = fixtures.invalidCredential();

      return API.login(invalidCredential)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        responseData.error.code.should.be.eql(errorCodes.Session[responseData.error.message]);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return token successfully', function() {
      const credential = fixtures.credential();

      return API.login(credential)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        return validate(sessionSchema)(responseData.data);
      });
    });
  });

  describe('logout', () => {

    beforeEach(() => {
      return API.login();
    });

    it('should return an error if token session is invalid', function() {
      API.setToken('123456');

      return API.logout()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        responseData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a success response', function() {
      return API.logout()
      .should.be.fulfilled
      .then(response => {
        response.status.should.be.equal(200);
        response.data.type.should.be.equal('Session');
        return validate(successSchema)(response.data);
      });
    });
  });


  describe('Session validations', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.createCompany())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.message.should.be.eql('Unauthorized');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if user role is not authorized', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.createCompany())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });
  });
});
