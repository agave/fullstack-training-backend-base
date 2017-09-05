const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const controller = require('../../../api/controllers/UsersController');
const helperFixtures = require('../fixtures/controllers/user');
const gateway = require('../../../api/helpers/gateway');
const errorHelper = require('../../../api/helpers/error');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/User controller', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('getInvitation', () => {

    const fixtures = helperFixtures.getInvitation;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, user, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(user));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvitation(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.getInvitation(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('registration', () => {

    const fixtures = helperFixtures.registration;
    const { request, invalidRequest, response, messageCall, responseType, responseData, responseError,
      guid, user, sendParams, passwordConfirmationErrorHelperParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(user));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if password_confirmation is different', () => {
      return controller.registration(invalidRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(passwordConfirmationErrorHelperParams);
      });
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.registration(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.registration(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('getRoles', () => {

    const fixtures = helperFixtures.getRoles;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, roles, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(roles));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getRoles(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.getRoles(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('delete', () => {

    const fixtures = helperFixtures.delete;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, user, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(user));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.delete(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.delete(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('resendInvitation', () => {

    const fixtures = helperFixtures.resendInvitation;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve());
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.resendInvitation(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.resendInvitation(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('changePassword', () => {

    const fixtures = helperFixtures.changePassword;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, sendParams, user, passwordConfirmationErrorHelperParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(user));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if the new password and the confirmation aren\'t the same', () => {
      const clonedRequest = _.cloneDeep(request);

      clonedRequest.body.confirmation_password = 'this is not the right confirmation';

      return controller.changePassword(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(passwordConfirmationErrorHelperParams);
      });
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.changePassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.changePassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('recoverPassword', () => {

    const fixtures = helperFixtures.recoverPassword;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve());
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.recoverPassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.recoverPassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('validateRecoverToken', () => {

    const fixtures = helperFixtures.validateRecoverToken;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, sendParams, validToken, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(validToken));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if gateway.sendUser returns a reject', () => {

      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.validateRecoverToken(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.validateRecoverToken(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });

  describe('resetPassword', () => {

    const fixtures = helperFixtures.resetPassword;
    const { request, invalidRequest, response, messageCall, responseType, responseData, responseError,
      guid, sendParams, user, passwordConfirmationErrorHelperParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(user));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if confirmation_password is different', () => {
      return controller.resetPassword(invalidRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(passwordConfirmationErrorHelperParams);
      });
    });

    it('should return an error if gateway.sendUser returns a reject', () => {

      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.resetPassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successfull response', () => {
      return controller.resetPassword(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithExactly(messageCall, responseData, responseType, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
      });
    });
  });
});
