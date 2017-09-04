const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const scheduled = require('../../../scheduled/transactions-monitor');
const helperFixtures = require('../fixtures/scheduled/transactions-monitor');

const uuid = require('uuid');
const log = require('/var/lib/core/js/log').prototype;

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Transactions monitor', () => {

  const fixtures = helperFixtures.transactionsMonitor;
  const {
    guid, startedLogParams, finishedLogParams
  } = fixtures;

  beforeEach(() => {
    sandbox.stub(log, 'message', () => true);
    sandbox.stub(log, 'error', () => true);
    sandbox.stub(uuid, 'v4', () => guid);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should produce event correctly', () => {
    return scheduled()
    .should.be.fulfilled
    .then(() => {
      uuid.v4.calledOnce.should.be.true;
      uuid.v4.calledWith().should.be.true;
      log.message.calledTwice.should.be.true;
      log.message.args[0].should.be.eql(startedLogParams);
      log.message.args[1].should.be.eql(finishedLogParams);
      log.error.called.should.be.false;
    });
  });
});
