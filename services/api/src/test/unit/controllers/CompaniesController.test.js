const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const controller = require('../../../api/controllers/CompaniesController');
const helperFixtures = require('../fixtures/controllers/company');
const gateway = require('../../../api/helpers/gateway');
const errorHelper = require('../../../api/helpers/error');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Company controller', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {

    const fixtures = helperFixtures.create;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, company, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(company));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.create(request, response)
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

    it('should return a successful response', () => {

      return controller.create(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('exists', () => {

    const fixtures = helperFixtures.exists;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, exists, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(exists));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.exists(request, response)
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

    it('should return a successful response', () => {

      return controller.exists(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('updateCompany', () => {

    const fixtures = helperFixtures.updateCompany;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, company, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(company));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.updateCompany(request, response)
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

    it('should return a successful response', () => {

      return controller.updateCompany(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('updateCompanyOperationCost', () => {

    const fixtures = helperFixtures.updateCompanyOperationCost;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, operationCost, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(operationCost));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.updateCompanyOperationCost(request, response)
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

    it('should return a successful response', () => {

      return controller.updateCompanyOperationCost(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('updateInvestorOperationCost', () => {

    const fixtures = helperFixtures.updateInvestorOperationCost;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, operationCost, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(operationCost));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.updateInvestorOperationCost(request, response)
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

    it('should return a successful response', () => {

      return controller.updateInvestorOperationCost(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getCompany', () => {

    const fixtures = helperFixtures.getCompany;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, company, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(company));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getCompany(request, response)
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

    it('should return a successful response', () => {

      return controller.getCompany(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getCompanies', () => {

    const fixtures = helperFixtures.getCompanies;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, companies, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(companies));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getCompanies(request, response)
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

    it('should return a successful response', () => {

      return controller.getCompanies(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getInvestorCompanies', () => {

    const fixtures = helperFixtures.getInvestorCompanies;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, companies, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(companies));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorCompanies(request, response)
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

    it('should return a successful response', () => {

      return controller.getInvestorCompanies(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getBankInfo', () => {

    const fixtures = helperFixtures.getBankInfo;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, bankInfo, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(bankInfo));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getBankInfo(request, response)
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

    it('should return a successful response', () => {

      return controller.getBankInfo(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('clabeExists', () => {

    const fixtures = helperFixtures.clabeExists;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, bankInfo, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(bankInfo));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.clabeExists(request, response)
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

    it('should return a successful response', () => {

      return controller.clabeExists(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getCompanyUsers', () => {

    const fixtures = helperFixtures.getCompanyUsers;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, usersList, sendParams, sendParamsWithQuery, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(usersList));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      const clonedRequest = _.cloneDeep(request);

      delete clonedRequest.query.order_by;
      delete clonedRequest.query.order_desc;

      return controller.getCompanyUsers(clonedRequest, response)
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

    it('should return a successful response if there were no query', () => {

      const clonedRequest = _.cloneDeep(request);

      delete clonedRequest.query.order_by;
      delete clonedRequest.query.order_desc;

      return controller.getCompanyUsers(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response', () => {

      return controller.getCompanyUsers(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsWithQuery);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getCompanyOperationCost', () => {

    const fixtures = helperFixtures.getCompanyOperationCost;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, operationCost, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(operationCost));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getCompanyOperationCost(request, response)
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

    it('should return a successful response', () => {

      return controller.getCompanyOperationCost(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getInvestorOperationCost', () => {

    const fixtures = helperFixtures.getInvestorOperationCost;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, operationInvestorCost, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(operationInvestorCost));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorOperationCost(request, response)
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

    it('should return a successful response', () => {

      return controller.getInvestorOperationCost(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('addUser', () => {

    const fixtures = helperFixtures.addUser;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, userInfo, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(userInfo));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.addUser(request, response)
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

    it('should return a successful response', () => {

      return controller.addUser(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWith(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('createInvestor', () => {

    const fixtures = helperFixtures.createInvestor;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, company, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(company));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.createInvestor(request, response)
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

    it('should return a successful response', () => {

      return controller.createInvestor(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('addInvestorUser', () => {

    const fixtures = helperFixtures.addInvestorUser;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, userInfo, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(userInfo));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.addInvestorUser(request, response)
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

    it('should return a successful response', () => {

      return controller.addInvestorUser(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWith(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getBalance', () => {

    const fixtures = helperFixtures.getBalance;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, balance, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(balance));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getBalance(request, response)
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

    it('should return a successful response', () => {

      return controller.getBalance(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('updateCompanyRoleSuspension', () => {

    const fixtures = helperFixtures.updateCompanyRoleSuspension;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve());
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.updateCompanyRoleSuspension(request, response)
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

    it('should return a successful response', () => {

      return controller.updateCompanyRoleSuspension(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('updateInvestorRoleSuspension', () => {

    const fixtures = helperFixtures.updateInvestorRoleSuspension;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve());
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.updateInvestorRoleSuspension(request, response)
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

    it('should return a successful response', () => {

      return controller.updateInvestorRoleSuspension(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('propose', () => {

    const fixtures = helperFixtures.propose;
    const { request, response, messageCall, responseType, success,
      responseData, responseError, guid, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(success));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.propose(request, response)
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

    it('should return a successful response', () => {

      return controller.propose(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });
});
