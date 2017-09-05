const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const lib = require('../../../lib/s3');
const helperFixtures = require('../fixtures/lib/s3');

chai.should();
chai.use(require('chai-as-promised'));

describe('lib/S3', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('upload', () => {

    const fixtures = helperFixtures.upload;
    const { logErrorParams, logMessageParams, key, body, putObjectParams, guid, error } = fixtures;

    beforeEach(() => {
      sandbox.stub(lib.s3, 'putObject', (params, callback) => callback());
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(log, 'error', () => true);
    });

    it('should return an error if upload fails', () => {

      lib.s3.putObject.restore();
      sandbox.stub(lib.s3, 'putObject', (params, callback) => callback(error));

      return lib.upload(key, body, guid)
      .should.be.rejected
      .then(result => {

        lib.s3.putObject.calledOnce.should.be.true;
        lib.s3.putObject.calledWithMatch(putObjectParams).should.be.true;
        log.message.called.should.be.false;
        log.error.calledOnce.should.be.true;
        log.error.args[0].should.be.eql(logErrorParams);
        error.should.be.eql(result);
      });
    });

    it('should return a successful response', () => {
      return lib.upload(key, body, guid)
      .should.be.fulfilled
      .then(result => {

        lib.s3.putObject.calledOnce.should.be.true;
        lib.s3.putObject.calledWithMatch(putObjectParams).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        log.error.called.should.be.false;
        key.should.be.eql(result);
      });
    });
  });

  describe('getUrl', () => {

    const fixtures = helperFixtures.getUrl;
    const { logErrorParams, logMessageParams, key, signedParams,
      guid, error, errorMessage, baseUrl } = fixtures;

    beforeEach(() => {
      sandbox.stub(lib.s3, 'getSignedUrl', (method, params, callback) => {
        return callback(null, baseUrl + params.Key);
      });
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(log, 'error', () => true);
    });

    it('should return an error if getSignedUrl fails', () => {

      lib.s3.getSignedUrl.restore();
      sandbox.stub(lib.s3, 'getSignedUrl', (method, params, callback) => callback(error));

      return lib.getUrl(key, guid)
      .should.be.fulfilled
      .then(result => {

        lib.s3.getSignedUrl.calledOnce.should.be.true;
        lib.s3.getSignedUrl.calledWithMatch(signedParams.first, signedParams.second).should.be.true;
        log.message.called.should.be.false;
        log.error.calledOnce.should.be.true;
        log.error.args[0].should.be.eql(logErrorParams);
        errorMessage.should.be.eql(result);
      });
    });

    it('should return a successful response', () => {

      return lib.getUrl(key, guid)
      .should.be.fulfilled
      .then(result => {

        lib.s3.getSignedUrl.calledOnce.should.be.true;
        lib.s3.getSignedUrl.calledWithMatch(signedParams.first, signedParams.second).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        log.error.called.should.be.false;
        result.should.be.eql(baseUrl + key);
      });
    });
  });
});
