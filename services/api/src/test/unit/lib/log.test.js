const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const lib = new (require('/var/lib/core/js/log'))(module);
const libFixtures = require('../fixtures/lib/log');

chai.should();

describe('unit/Logger', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('message', () => {

    const fixtures = libFixtures.message;
    const { message, data, type, guid, cleanLog } = fixtures;

    before(() => {
      sandbox.stub(lib.log, 'info', () => true);
    });

    it('should log message omiting forbidden fields', () => {
      return Promise.resolve()
      .then(() => {
        lib.message(message, data, type, guid);
        lib.log.info.calledOnce.should.be.true;
        lib.log.info.calledWith(cleanLog).should.be.true;
      });
    });
  });

  describe('error', () => {

    const fixtures = libFixtures.error;
    const { error, data, guid, cleanLog } = fixtures;

    before(() => {
      sandbox.stub(lib.log, 'error', () => true);
    });

    it('should log error omiting forbidden fields', () => {
      return Promise.resolve()
      .then(() => {
        lib.error(error, guid, data);
        lib.log.error.calledOnce.should.be.true;
        lib.log.error.calledWith(cleanLog).should.be.true;
      });
    });
  });

  describe('warn', () => {

    const fixtures = libFixtures.warn;
    const { message, data, guid, cleanLog } = fixtures;

    before(() => {
      sandbox.stub(lib.log, 'warn', () => true);
    });

    it('should log warning omiting forbidden fields', () => {
      return Promise.resolve()
      .then(() => {
        lib.warn(message, data, guid);
        lib.log.warn.calledOnce.should.be.true;
        lib.log.warn.calledWith(cleanLog).should.be.true;
      });
    });
  });
});
