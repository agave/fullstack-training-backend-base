const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const mailer = require('../../../lib/mailer');
const fixtures = require('../fixtures/mailer');

chai.should();
chai.use(chaiAsPromised);

describe('functional/Mailer', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('send', () => {

    beforeEach(() => {
      sandbox.stub(mailer, 'isTest', () => false);
    });

    it('should return an error if the template is not present', () => {
      const params = fixtures.nonExistenttemplate();

      return mailer.send(params.template, params.data, params.email, params.subject)
      .should.be.rejected;
    });

    it('should return a success response if the email is invalid', () => {
      const params = fixtures.invalidEmail();

      return mailer.send(params.template, params.data, params.email, params.subject)
      .should.be.fulfilled;
    });

    it('should return a success response when a test tried to send an email', () => {
      const params = fixtures.valid();

      mailer.isTest.restore();
      sandbox.stub(mailer, 'isTest', () => true);

      return mailer.send(params.template, params.data, params.email, params.subject)
      .should.be.fulfilled;
    });

    it('should send an email', () => {
      const params = fixtures.valid();

      return mailer.send(params.template, params.data, params.email, params.subject)
      .should.be.fulfilled;
    });
  });
});
