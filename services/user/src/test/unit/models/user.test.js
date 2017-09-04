const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const sandbox = sinon.sandbox.create();
const helperFixtures = require('../fixtures/models/user');

const UserModel = require('../../../api/models/User');
const optionsModel = UserModel.options;

const { User } = require('../../../models');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/User model', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('beforeCreate', () => {

    const fixtures = helperFixtures.beforeCreate;
    const { hooks } = optionsModel;
    const { instance } = fixtures;

    beforeEach(() => {
      sandbox.stub(bcrypt, 'genSalt', () => Promise.resolve(10));
      sandbox.stub(bcrypt, 'hash', () => Promise.resolve(instance.password));
    });

    it('should return error if bcrypt.genSalt return a rejected', () => {
      const error = new Error('genSalt error');

      bcrypt.genSalt.restore();
      sandbox.stub(bcrypt, 'genSalt', () => Promise.reject(error));

      return hooks.beforeCreate(instance)
      .should.be.rejected
      .then(() => {
        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.calledWith(10).should.be.true;
        bcrypt.hash.called.should.be.false;
      });
    });

    it('should return error if bcrypt.hash return a rejected', () => {
      const error = new Error('hash error');

      bcrypt.hash.restore();
      sandbox.stub(bcrypt, 'hash', () => Promise.reject(error));

      return hooks.beforeCreate(instance)
      .should.be.rejected
      .then(() => {
        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.calledWith(10).should.be.true;
        bcrypt.hash.calledOnce.should.be.true;
        bcrypt.hash.calledWith(instance.password, 10).should.be.true;
      });
    });

    it('should return a successful response', () => {
      return hooks.beforeCreate(instance)
      .should.be.fulfilled
      .then(() => {
        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.calledWith(10).should.be.true;
        bcrypt.hash.calledOnce.should.be.true;
        bcrypt.hash.calledWith(instance.password, 10).should.be.true;
      });
    });
  });

  describe('beforeValidate', () => {

    const fixtures = helperFixtures.beforeValidate;
    const { hooks } = optionsModel;
    const { instance } = fixtures;

    it('should return a successful response', () => {
      return hooks.beforeValidate(instance)
      .should.be.fulfilled
      .then(response => {

        response.role.should.be.eql(instance.role.toUpperCase());
      });
    });
  });

  describe('verify', () => {

    const fixtures = helperFixtures.verify;
    const { classMethods } = optionsModel;
    const { request, userModel, context, findOneCall } = fixtures;

    beforeEach(() => {
      sandbox.stub(context, 'findOne', () => Promise.resolve(userModel));
      sandbox.stub(bcrypt, 'compare', () => Promise.resolve(true));
    });

    it('should return error if this.findOne fails', () => {
      const error = new Error('Find error');

      context.findOne.restore();
      sandbox.stub(context, 'findOne', () => Promise.reject(error));

      return classMethods.verify.call(context, request.email, request.password)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        bcrypt.compare.called.should.be.false;
      });
    });

    it('should return error if bcrypt.compare fails', () => {
      const error = new Error('bcrypt error');

      bcrypt.compare.restore();
      sandbox.stub(bcrypt, 'compare', () => Promise.reject(error));

      return classMethods.verify.call(context, request.email, request.password)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.calledWith(request.password, userModel.password).should.be.true;
      });
    });

    it('should return error if bcrypt.compare returns false', () => {
      const error = new Error('bcrypt error');

      bcrypt.compare.restore();
      sandbox.stub(bcrypt, 'compare', () => Promise.reject(error));

      return classMethods.verify.call(context, request.email, request.password)
      .should.be.rejected
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.calledWith(request.password, userModel.password).should.be.true;
      });
    });

    it('should return a successful response', () => {

      return classMethods.verify.call(context, request.email, request.password)
      .should.be.fulfilled
      .then(() => {
        context.findOne.calledOnce.should.be.true;
        context.findOne.calledWith(findOneCall).should.be.true;
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.calledWith(request.password, userModel.password).should.be.true;
      });
    });
  });

  describe('getInformation', () => {

    const fixtures = helperFixtures.getInformation;
    const { instanceMethods } = optionsModel;
    const { instance, fullInformation } = fixtures;

    it('should return a successful response', () => {

      const method = instanceMethods.getInformation.bind(instance);

      return method()
      .should.be.fulfilled
      .then((response) => {
        response.should.be.deep.equal(fullInformation);
      });
    });
  });

  describe('updatePassword', () => {

    const fixtures = helperFixtures.updatePassword;
    const { classMethods } = optionsModel;
    const { request, user, cleanUser, encryptedPassword, query, password,
      commonError, invalidPasswordError } = fixtures;

    beforeEach(() => {
      sandbox.stub(User, 'findOne', () => Promise.resolve(_.cloneDeep(user)));
      sandbox.stub(bcrypt, 'compare', () => Promise.resolve(true));
      sandbox.stub(User, 'encryptPassword', () => Promise.resolve(encryptedPassword));
      sandbox.stub(user, 'save', () => Promise.resolve(user));
    });

    it('should return an error if there was an error with the User.findOne method ', () => {

      User.findOne.restore();
      sandbox.stub(User, 'findOne', () => Promise.reject(commonError));

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.rejected
      .then((error) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.called.should.be.false;
        User.encryptPassword.called.should.be.false;
        user.save.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if there was an error with the bcrypt.compare method ', () => {

      bcrypt.compare.restore();
      sandbox.stub(bcrypt, 'compare', () => Promise.reject(commonError));

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.rejected
      .then((error) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.args[0].should.be.eql([ request.actual_password, password ]);
        User.encryptPassword.called.should.be.false;
        user.save.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if the actual_password does not match with the current', () => {

      bcrypt.compare.restore();
      sandbox.stub(bcrypt, 'compare', () => Promise.resolve(false));

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.rejected
      .then((error) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.args[0].should.be.eql([ request.actual_password, password ]);
        User.encryptPassword.called.should.be.false;
        user.save.called.should.be.false;
        error.should.be.deep.equal(invalidPasswordError);
      });
    });

    it('should return an error if there was an issue encryting the password', () => {

      User.encryptPassword.restore();
      sandbox.stub(User, 'encryptPassword', () => Promise.reject(commonError));

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.rejected
      .then((error) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.args[0].should.be.eql([ request.actual_password, password ]);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ request.new_password ]);
        user.save.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if there was an issue saving the instance ', () => {

      user.save.restore();
      sandbox.stub(user, 'save', () => Promise.reject(commonError));

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.rejected
      .then((error) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.args[0].should.be.eql([ request.actual_password, password ]);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ request.new_password ]);
        user.save.calledOnce.should.be.true;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return a successful response', () => {

      return classMethods.updatePassword(request.user_id, request.actual_password, request.new_password)
      .should.be.fulfilled
      .then((response) => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        bcrypt.compare.calledOnce.should.be.true;
        bcrypt.compare.args[0].should.be.eql([ request.actual_password, password ]);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ request.new_password ]);
        user.save.calledOnce.should.be.true;
        response.should.be.deep.equal(cleanUser);
      });
    });
  });

  describe('encryptPassword', () => {

    const fixtures = helperFixtures.encryptPassword;
    const { classMethods } = optionsModel;
    const { password, commonError } = fixtures;

    beforeEach(() => {
      sandbox.stub(bcrypt, 'genSalt', () => Promise.resolve(true));
      sandbox.stub(bcrypt, 'hash', () => Promise.resolve(true));
    });

    it('should return an error if there was an error with the bcrypt.genSalt method ', () => {

      bcrypt.genSalt.restore();
      sandbox.stub(bcrypt, 'genSalt', () => Promise.reject(commonError));

      return classMethods.encryptPassword(password)
      .should.be.rejected
      .then((error) => {

        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.args[0].should.be.eql([ 10 ]);
        bcrypt.hash.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if there was an error with the bcrypt.hash method ', () => {

      bcrypt.hash.restore();
      sandbox.stub(bcrypt, 'hash', () => Promise.reject(commonError));

      return classMethods.encryptPassword(password)
      .should.be.rejected
      .then((error) => {

        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.args[0].should.be.eql([ 10 ]);
        bcrypt.hash.calledOnce.should.be.true;
        bcrypt.hash.args[0].should.be.eql([ password, true ]);
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return a success if there was no error', () => {

      return classMethods.encryptPassword(password)
      .should.be.fulfilled
      .then(() => {

        bcrypt.genSalt.calledOnce.should.be.true;
        bcrypt.genSalt.args[0].should.be.eql([ 10 ]);
        bcrypt.hash.calledOnce.should.be.true;
        bcrypt.hash.args[0].should.be.eql([ password, true ]);
      });
    });
  });

  describe('resetPassword', () => {

    const fixtures = helperFixtures.resetPassword;
    const { classMethods } = optionsModel;
    const { request, user, cleanUser, encryptedPassword, query, password,
      commonError } = fixtures;

    beforeEach(() => {
      sandbox.stub(User, 'findOne', () => Promise.resolve(_.cloneDeep(user)));
      sandbox.stub(User, 'encryptPassword', () => Promise.resolve(encryptedPassword));
      sandbox.stub(user, 'save', () => Promise.resolve(user));
    });

    it('should return an error if there was an error with the User.findOne method ', () => {

      User.findOne.restore();
      sandbox.stub(User, 'findOne', () => Promise.reject(commonError));

      return classMethods.resetPassword(request.email, request.password)
      .should.be.rejected
      .then(error => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        User.encryptPassword.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if there was an error with the User.encryptPassword method ', () => {

      User.encryptPassword.restore();
      sandbox.stub(User, 'encryptPassword', () => Promise.reject(commonError));

      return classMethods.resetPassword(request.email, request.password)
      .should.be.rejected
      .then(error => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ password ]);
        user.save.called.should.be.false;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return an error if there was an error with the user.save method ', () => {

      user.save.restore();
      sandbox.stub(user, 'save', () => Promise.reject(commonError));

      return classMethods.resetPassword(request.email, request.password)
      .should.be.rejected
      .then(error => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ password ]);
        user.save.calledOnce.should.be.true;
        error.should.be.deep.equal(commonError);
      });
    });

    it('should return a successful response', () => {

      return classMethods.resetPassword(request.email, request.password)
      .should.be.fulfilled
      .then(response => {

        User.findOne.calledOnce.should.be.true;
        User.findOne.args[0].should.be.eql(query);
        User.encryptPassword.calledOnce.should.be.true;
        User.encryptPassword.args[0].should.be.eql([ password ]);
        user.save.calledOnce.should.be.true;
        response.should.be.deep.equal(cleanUser);
      });
    });
  });
});
