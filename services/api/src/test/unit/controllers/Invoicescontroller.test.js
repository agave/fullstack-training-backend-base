const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const controller = require('../../../api/controllers/InvoicesController');
const helperFixtures = require('../fixtures/controllers/invoice');

const gateway = require('../../../api/helpers/gateway');
const utils = require('../../../api/helpers/utils');
const errorHelper = require('../../../api/helpers/error');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Invoice controller', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {

    const fixtures = helperFixtures.create;
    const { request, responseParams, xml, validatedXml, responseError, invoiceInfo,
      response, path, sendUserParams, sendCfdiParams, responseData, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendCfdi', () => Promise.resolve(validatedXml));
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoiceInfo));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(utils, 'readFile', () => Promise.resolve(xml));
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if readFile return a reject', () => {
      utils.readFile.restore();
      sandbox.stub(utils, 'readFile', () => Promise.reject(responseError.error));

      return controller.create(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql([ path ]);
        gateway.sendCfdi.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return an error if sendCfdi return a reject', () => {
      gateway.sendCfdi.restore();
      sandbox.stub(gateway, 'sendCfdi', () => Promise.reject(responseError.error));

      return controller.create(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql([ path ]);
        gateway.sendCfdi.calledOnce.should.be.true;
        gateway.sendCfdi.args[0].should.be.eql(sendCfdiParams);
        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return an error if sendUser return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.create(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql([ path ]);
        gateway.sendCfdi.calledOnce.should.be.true;
        gateway.sendCfdi.args[0].should.be.eql(sendCfdiParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendUserParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a success if there was no issue', () => {

      return controller.create(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql([ path ]);
        gateway.sendCfdi.calledOnce.should.be.true;
        gateway.sendCfdi.args[0].should.be.eql(sendCfdiParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendUserParams);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(responseParams);
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getInvoices', () => {

    const fixtures = helperFixtures.getInvoices;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoiceList, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoiceList));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvoices(request, response)
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

      return controller.getInvoices(request, response)
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

  describe('getInvoice', () => {

    const fixtures = helperFixtures.getInvoice;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvoice(request, response)
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

      return controller.getInvoice(request, response)
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

  describe('approve', () => {

    const fixtures = helperFixtures.approve;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.approve(request, response)
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

      return controller.approve(request, response)
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

  describe('reject', () => {

    const fixtures = helperFixtures.reject;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.reject(request, response)
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

      return controller.reject(request, response)
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

  describe('fund', () => {

    const fixtures = helperFixtures.fund;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.fund(request, response)
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

      return controller.fund(request, response)
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

  describe('completed', () => {

    const fixtures = helperFixtures.completed;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams,
      invalidCXPDateErrorHelperParams, invalidFondeoDateErrorHelperParams
    } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.completed(request, response)
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

    it('should return an error if cxp_payment_date is invalid', () => {
      const invalidRequest = _.cloneDeep(request);

      invalidRequest.body.cxp_payment_date = 'invalid';

      return controller.completed(invalidRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(invalidCXPDateErrorHelperParams);
      });
    });

    it('should return an error if fondeo_payment_date is invalid', () => {
      const invalidRequest = _.cloneDeep(request);

      invalidRequest.body.fondeo_payment_date = 'invalid';

      return controller.completed(invalidRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(invalidFondeoDateErrorHelperParams);
      });
    });

    it('should return a successful response', () => {

      return controller.completed(request, response)
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

  describe('lost', () => {

    const fixtures = helperFixtures.lost;
    const { request, response, messageCall, responseType, requestBadPaymentDate,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams, errorDateParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.lost(request, response)
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

    it('should return an error if payment date has a wrong format', () => {
      return controller.lost(requestBadPaymentDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorDateParams);
      });
    });

    it('should return a successful response', () => {

      return controller.lost(request, response)
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

  describe('latePayment', () => {

    const fixtures = helperFixtures.latePayment;
    const { request, response, messageCall, responseType, requestBadFondeoDate, requestBadCxpDate,
      responseData, responseError, guid, invoice, sendParams,
      errorHelperParams, errorFondeoDateParams, errorCxpDateParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.latePayment(request, response)
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

    it('should return an error if request does not have fondeo payment date', () => {
      return controller.latePayment(requestBadFondeoDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorFondeoDateParams);
      });
    });

    it('should return an error if does not have cxp payment date', () => {
      return controller.latePayment(requestBadCxpDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorCxpDateParams);
      });
    });

    it('should return a successful response', () => {

      return controller.latePayment(request, response)
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

  describe('rejectPublished', () => {

    const fixtures = helperFixtures.rejectPublished;
    const { cxcRequest, adminRequest, response, messageCall, responseType,
      responseData, responseError, guid, invoice, cxcSendParams,
      adminSendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject(CXC)', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.rejectPublished(cxcRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(cxcSendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return an error if send return a reject(ADMIN)', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.rejectPublished(adminRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(adminSendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response(CXC)', () => {

      return controller.rejectPublished(cxcRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(cxcSendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response(ADMIN)', () => {

      return controller.rejectPublished(adminRequest, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(adminSendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('rejectFunded', () => {

    const fixtures = helperFixtures.rejectFunded;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.rejectFunded(request, response)
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

      return controller.rejectFunded(request, response)
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

  describe('approveFund', () => {

    const fixtures = helperFixtures.approveFund;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.approveFund(request, response)
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

      return controller.approveFund(request, response)
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

  describe('getEstimate', () => {

    const fixtures = helperFixtures.getEstimate;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, estimate, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(estimate));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getEstimate(request, response)
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

      return controller.getEstimate(request, response)
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

  describe('getDetail', () => {

    const fixtures = helperFixtures.getDetail;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getDetail(request, response)
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

      return controller.getDetail(request, response)
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

  describe('publish', () => {

    const fixtures = helperFixtures.publish;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoice, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.publish(request, response)
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

      return controller.publish(request, response)
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

  describe('getFundEstimate', () => {

    const fixtures = helperFixtures.getFundEstimate;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, fundEstimate, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(fundEstimate));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getFundEstimate(request, response)
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

      return controller.getFundEstimate(request, response)
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

  describe('getXml', () => {

    const fixtures = helperFixtures.getXml;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, sendParams, errorHelperParams, setCallWith } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(responseData));
      sandbox.stub(response, 'set', () => Promise.resolve());
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getXml(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        response.set.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response', () => {

      return controller.getXml(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.set.calledOnce.should.be.true;
        response.set.calledWithMatch(setCallWith).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData.xml).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getMarketplace', () => {

    const fixtures = helperFixtures.getMarketplace;
    const { request, response, messageCall, responseType, requestOrder, requestSubtotals, sendParamsOrder,
      sendParamsSubtotals, responseData, responseError, guid, marketplaceList, sendParams,
      errorHelperParams, requestInvalidStartDate, startDateError, endDateError, requestInvalidEndtDate } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(marketplaceList));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getMarketplace(request, response)
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

    it('should return an error if start_date has invalid value', () => {

      return controller.getMarketplace(requestInvalidStartDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(startDateError);
      });
    });

    it('should return an error if end_date has invalid value', () => {

      return controller.getMarketplace(requestInvalidEndtDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(endDateError);
      });
    });

    it('should return a successful response', () => {

      return controller.getMarketplace(request, response)
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

    it('should return a successful response if we use order params', () => {

      return controller.getMarketplace(requestOrder, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsOrder);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response if we use subtotals values', () => {

      return controller.getMarketplace(requestSubtotals, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsSubtotals);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getInvestorFundEstimate', () => {

    const fixtures = helperFixtures.getInvestorFundEstimate;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, fundEstimate, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(fundEstimate));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorFundEstimate(request, response)
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

      return controller.getInvestorFundEstimate(request, response)
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

  describe('getInvestorProfitEstimate', () => {

    const fixtures = helperFixtures.getInvestorProfitEstimate;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, profitEstimate, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(profitEstimate));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorProfitEstimate(request, response)
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

      return controller.getInvestorProfitEstimate(request, response)
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

  describe('getInvestorInvoices', () => {

    const fixtures = helperFixtures.getInvestorInvoices;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoiceList, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoiceList));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorInvoices(request, response)
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

      return controller.getInvestorInvoices(request, response)
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

    it('should return a successful response with order_by', () => {
      const clonedRequest = _.cloneDeep(request);

      clonedRequest.order_by = 'client_name';

      return controller.getInvestorInvoices(clonedRequest, response)
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

    it('should return a successful response with order_desc', () => {
      const clonedRequest = _.cloneDeep(request);

      clonedRequest.order_by = 'client_name';
      clonedRequest.order_desc = true;

      return controller.getInvestorInvoices(clonedRequest, response)
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

  describe('getInvestorFundDetail', () => {

    const fixtures = helperFixtures.getInvestorFundDetail;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, operationTerm, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(operationTerm));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvestorFundDetail(request, response)
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

      return controller.getInvestorFundDetail(request, response)
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

  describe('getInvoicePaymentSummary', () => {

    const fixtures = helperFixtures.getInvoicePaymentSummary;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, summary, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(summary));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvoicePaymentSummary(request, response)
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

      return controller.getInvoicePaymentSummary(request, response)
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

  describe('getAdminInvoices', () => {

    const fixtures = helperFixtures.getAdminInvoices;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, invoiceList, sendParams, errorHelperParams,
      requestInvalidStartFundDate, requestInvalidEndFundDate, requestInvalidEndExpirationDate,
      requestInvalidStartExpirationDate, startFundDateError, endFundDateError,
      startExpirationDateError, endExpirationDateError } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoiceList));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getAdminInvoices(request, response)
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

      return controller.getAdminInvoices(request, response)
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

    it('should return an error if start_fund_date has invalid value', () => {

      return controller.getAdminInvoices(requestInvalidStartFundDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(startFundDateError);
      });
    });

    it('should return an error if end_fund_date has invalid value', () => {

      return controller.getAdminInvoices(requestInvalidEndFundDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(endFundDateError);
      });
    });

    it('should return an error if start_expiration_date has invalid value', () => {

      return controller.getAdminInvoices(requestInvalidStartExpirationDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(startExpirationDateError);
      });
    });

    it('should return an error if end_expiration_date has invalid value', () => {

      return controller.getAdminInvoices(requestInvalidEndExpirationDate, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(endExpirationDateError);
      });
    });
  });

  describe('getInvoiceDetailAsAdmin', () => {

    const fixtures = helperFixtures.getInvoiceDetailAsAdmin;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, adminInvoiceDetailNotFormated, sendParams, errorHelperParams,
      adminInvoiceDetailWithoutOperationSummaryNotFormated, responseDataWithoutOperationSummary,
      adminInvoiceDetailWithoutcxcPaymentNotFormated, responseDataWithoutcxcPayment,
      adminInvoiceDetailWithoutInvestorPaymentNotFormated, responseDataWithoutInvestorPayment } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(adminInvoiceDetailNotFormated));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getInvoiceDetailAsAdmin(request, response)
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

    it('should return a successful response if operation summary is not present', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(adminInvoiceDetailWithoutOperationSummaryNotFormated));

      return controller.getInvoiceDetailAsAdmin(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(
          messageCall, responseDataWithoutOperationSummary, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseDataWithoutOperationSummary).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
    it('should return a successful response if operation cxc payment not present', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(adminInvoiceDetailWithoutcxcPaymentNotFormated));

      return controller.getInvoiceDetailAsAdmin(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseDataWithoutcxcPayment, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseDataWithoutcxcPayment).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
    it('should return a successful response if investor payment is not present', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(adminInvoiceDetailWithoutInvestorPaymentNotFormated));

      return controller.getInvoiceDetailAsAdmin(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseDataWithoutInvestorPayment, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseDataWithoutInvestorPayment).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response', () => {

      return controller.getInvoiceDetailAsAdmin(request, response)
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
