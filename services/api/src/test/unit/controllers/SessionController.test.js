const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const controller = require('../../../api/controllers/SessionsController');
const helperFixtures = require('../fixtures/controllers/session');
const gateway = require('../../../api/helpers/gateway');
const errorHelper = require('../../../api/helpers/error');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Session controller', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('login', () => {

    const fixtures = helperFixtures.login;
    const { request, response, messageCall, responseType, responseData,
      responseError, guid, session, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(session));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.login(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.calledWithMatch(sendParams[0], sendParams[1], sendParams[2]).should.be.true;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response', () => {
      return controller.login(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.calledWithMatch(sendParams[0], sendParams[1], sendParams[2]).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('logout', () => {

    const fixtures = helperFixtures.logout;
    const { request, response, session, guid, sendParams, messageCall,
      responseType, responseData, responseError, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(session));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.logout(request, response)
      .should.be.fulfilled
      .then(() => {
        log.message.called.should.be.false;
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.calledWith(sendParams[0], sendParams[1], sendParams[2]).should.be.true;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response', () => {
      return controller.logout(request, response)
      .should.be.fulfilled
      .then(() => {
        log.message.calledOnce.should.be.true;
        log.message.calledWith(messageCall, responseData, responseType, guid).should.be.true;
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.calledWith(sendParams[0], sendParams[1], sendParams[2]).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWith(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });
});
