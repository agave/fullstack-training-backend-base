const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const middleware = require('../../../middleware/log');
const fixture = require('../fixtures/middleware/log');

const log = require('/var/lib/core/js/log').prototype;
const uuid = require('uuid');

chai.should();

describe('unit/Log middleware', () => {

  const randString = fixture.uuid;

  before(() => {
    sandbox.stub(uuid, 'v4', () => randString);
    sandbox.stub(log, 'message', () => true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should log the desired data without forbidden fields', () => {
    const callback = sandbox.spy();
    const req = _.merge(fixture.request, sandbox.spy());

    return middleware(req, {}, callback).then(() => {

      req.guid.should.be.eql(randString);
      log.message.calledOnce.should.be.true;
      log.message.calledWithExactly(req.originalUrl, fixture.logged, req.method, randString)
      .should.be.true;
      callback.calledOnce.should.be.true;
    });
  });
});
