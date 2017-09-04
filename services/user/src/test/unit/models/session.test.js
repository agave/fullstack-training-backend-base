const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helperFixtures = require('../fixtures/models/session');

const randtoken = require('rand-token');
const Session = require('../../../api/models/Session');
const { User } = require('../../../models');
const optionsModel = Session.options;

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Session model', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('beforeCreate', () => {

    const fixtures = helperFixtures.beforeCreate;
    const { hooks } = optionsModel;
    const { instance, token } = fixtures;

    beforeEach(() => {
      sandbox.stub(randtoken, 'generate', () => token);
    });

    it('should return a successful response', () => {
      return hooks.beforeCreate(instance)
      .should.be.fulfilled
      .then(() => {
        randtoken.generate.calledOnce.should.be.true;
        randtoken.generate.calledWith(16).should.be.true;
      });
    });
  });

  describe('verifyAndCreate', () => {

    const fixtures = helperFixtures.verifyAndCreate;
    const { classMethods } = optionsModel;
    const { email, password, unsuspendedUserModel, context, unsuspendedSessionModel,
      suspendedUserModel, suspendedSessionModel } = fixtures;

    beforeEach(() => {
      sandbox.stub(User, 'verify', () => Promise.resolve(unsuspendedUserModel));
      sandbox.stub(context, 'create', () => Promise.resolve());
    });

    it('should return error if User.verify has an error', () => {
      const error = new Error('verify error');

      User.verify.restore();
      sandbox.stub(User, 'verify', () => Promise.reject(error));

      return classMethods.verifyAndCreate.call(context, email, password)
      .should.be.rejected
      .then(() => {
        User.verify.calledOnce.should.be.true;
        User.verify.calledWith(email, password).should.be.true;
        context.create.called.should.be.false;
      });
    });

    it('should return error if self.create has an error', () => {
      const error = new Error('create error');

      context.create.restore();
      sandbox.stub(context, 'create', () => Promise.reject(error));

      return classMethods.verifyAndCreate.call(context, email, password)
      .should.be.rejected
      .then(() => {
        User.verify.calledOnce.should.be.true;
        User.verify.calledWith(email, password).should.be.true;
        context.create.calledOnce.should.be.true;
        context.create.calledWith(unsuspendedSessionModel).should.be.true;
      });
    });

    it('should return a suspended successful response', () => {

      User.verify.restore();
      sandbox.stub(User, 'verify', () => Promise.resolve(suspendedUserModel));

      return classMethods.verifyAndCreate.call(context, email, password)
      .should.be.fulfilled
      .then(() => {
        User.verify.calledOnce.should.be.true;
        User.verify.calledWith(email, password).should.be.true;
        context.create.calledOnce.should.be.true;
        context.create.calledWith(suspendedSessionModel).should.be.true;
      });
    });

    it('should return an unsuspended successful response', () => {
      return classMethods.verifyAndCreate.call(context, email, password)
      .should.be.fulfilled
      .then(() => {
        User.verify.calledOnce.should.be.true;
        User.verify.calledWith(email, password).should.be.true;
        context.create.calledOnce.should.be.true;
        context.create.calledWith(unsuspendedSessionModel).should.be.true;
      });
    });
  });

  describe('checkToken', () => {

    const fixtures = helperFixtures.checkTokenModel;
    const { classMethods } = optionsModel;
    const { context, token, findOneCall, validSession, invalidSession } = fixtures;

    beforeEach(() => {
      sandbox.stub(context, 'findOne', () => Promise.resolve(validSession));
      sandbox.stub(validSession, 'save', () => Promise.resolve());
    });

    it('should return error if findOne return an error', () => {
      context.findOne.restore();
      sandbox.stub(context, 'findOne', () => Promise.reject());

      return classMethods.checkToken.call(context, token)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        validSession.save.called.should.be.false;
      });
    });

    it('should return error if session does not exists', () => {
      context.findOne.restore();
      sandbox.stub(context, 'findOne', () => Promise.resolve());

      return classMethods.checkToken.call(context, token)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        validSession.save.called.should.be.false;
      });
    });

    it('should return error if session was expired', () => {
      context.findOne.restore();
      sandbox.stub(context, 'findOne', () => Promise.resolve(invalidSession));

      return classMethods.checkToken.call(context, token)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        validSession.save.called.should.be.false;
      });
    });

    it('should return a successful response', () => {
      return classMethods.checkToken.call(context, token)
      .should.be.fulfilled
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        validSession.save.calledOnce.should.be.true;
      });
    });
  });
});
