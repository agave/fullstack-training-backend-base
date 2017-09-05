const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helper = require('../../../api/helpers/error');
const helperFixtures = require('../fixtures/helpers/error');

const log = require('/var/lib/core/js/log').prototype;

chai.should();

describe('unit/Error helper', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('format', () => {

    const fixtures = helperFixtures.format;
    const { invalidRequestParams, notFoundParams, unassignedTypeParams, unassignedMsgParams, existingCodeParams,
      invalidRequestError, notFoundError, unassignedTypeError, unassignedMsgError, existingCodeError } = fixtures;

    it('should return invalid request error code', () => {
      return Promise.resolve()
      .then(() => {
        invalidRequestError.should.be.eql(helper.format.apply(helper, invalidRequestParams));
      });
    });

    it('should return not found error code', () => {
      return Promise.resolve()
      .then(() => {
        notFoundError.should.be.eql(helper.format.apply(helper, notFoundParams));
      });
    });

    it('should return unassigned error code if type in error dictionary', () => {
      return Promise.resolve()
      .then(() => {
        unassignedTypeError.should.be.eql(helper.format.apply(helper, unassignedTypeParams));
      });
    });

    it('should return unassigned error code if message not in type', () => {
      return Promise.resolve()
      .then(() => {
        unassignedMsgError.should.be.eql(helper.format.apply(helper, unassignedMsgParams));
      });
    });

    it('should return error code corresponding to type and message', () => {
      return Promise.resolve()
      .then(() => {
        existingCodeError.should.be.eql(helper.format.apply(helper, existingCodeParams));
      });
    });
  });

  describe('handleResponse', () => {

    const fixtures = helperFixtures.handleResponse;
    const { type, error, guid, response, formattedError } = fixtures;

    before(() => {
      sandbox.stub(helper, 'format', () => formattedError);
      sandbox.stub(log, 'error', () => true);
      sandbox.stub(response, 'send', () => true);
    });

    it('should format error and create response', () => {
      return helper.handleResponse(type, error, guid, response)
      .then(() => {
        helper.format.calledOnce.should.be.true;
        helper.format.calledWithExactly(type, error).should.be.true;
        log.error.calledOnce.should.be.true;
        log.error.calledWithExactly(error, guid, formattedError).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithExactly(formattedError).should.be.true;
      });
    });
  });
});
