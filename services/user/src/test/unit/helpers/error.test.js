const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const helper = require('../../../api/helpers/error');
const helperFixtures = require('../fixtures/helpers/error');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Error helper', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('format', () => {

    const fixtures = helperFixtures.format;
    const { err, errMessage, errorFormatted, guid } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'error', () => true);
    });

    it('should return a successful response', () => {
      const callback = sandbox.spy();
      const stringifiedError = new Error(JSON.stringify(errorFormatted));

      return helper.format(errMessage, guid, callback)
      .should.be.fulfilled
      .then(() => {

        log.error.calledOnce.should.be.true;
        log.error.calledWithMatch(errMessage, guid).should.be.true;
        callback.calledOnce.should.be.true;
        callback.calledWithMatch(stringifiedError).should.be.true;
      });
    });

    it('should return a successful response with sequelize error', () => {
      const callback = sandbox.spy();
      const stringifiedError = new Error(JSON.stringify(err.errors[0]));

      return helper.format(err, guid, callback)
      .should.be.fulfilled
      .then(() => {

        log.error.calledOnce.should.be.true;
        log.error.calledWithMatch(err, guid).should.be.true;
        callback.calledOnce.should.be.true;
        callback.calledWithMatch(stringifiedError).should.be.true;
      });
    });
  });
});
