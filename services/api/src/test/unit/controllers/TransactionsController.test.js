const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const log = require('/var/lib/core/js/log').prototype;
const controller = require('../../../api/controllers/TransactionsController');
const helperFixtures = require('../fixtures/controllers/transaction');

const s3 = require('../../../lib/s3');
const gateway = require('../../../api/helpers/gateway');
const errorHelper = require('../../../api/helpers/error');
const utils = require('../../../api/helpers/utils');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Transaction controller', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('withdraw', () => {

    const fixtures = helperFixtures.withdraw;
    const { request, response, messageCall, responseType,
      responseData, responseError, guid, transaction, sendParams, errorHelperParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transaction));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.withdraw(request, response)
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

      return controller.withdraw(request, response)
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

  describe('getPendingTransactions', () => {

    const fixtures = helperFixtures.getPendingTransactions;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, transactions, sendParams, errorHelperParams, baseUrl } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactions));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
      sandbox.stub(s3, 'getUrl', (name) => Promise.resolve(baseUrl + name));
    });

    it('should return an error if send return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getPendingTransactions(request, response)
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

    it('should return an error if getUrl does not work', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getPendingTransactions(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        s3.getUrl.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response', () => {

      const key = JSON.parse(transactions.transactions[1].data).key;

      return controller.getPendingTransactions(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.args[0].should.be.eql([ key, guid ]);
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('deposit', () => {


    const fixtures = helperFixtures.deposit;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, transaction, sendParams, errorHelperParams, fileUrl, buffer,
      readFileParams, uploadParams, noFileErrorHelperParams, invalidFileErrorHelperParams,
      key } = fixtures;
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date(2017, 6, 3).getTime());
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transaction));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(utils, 'readFile', () => Promise.resolve(buffer));
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
      sandbox.stub(s3, 'upload', () => Promise.resolve());
      sandbox.stub(s3, 'getUrl', () => fileUrl);
    });

    after(() => {
      clock.restore();
    });

    it('should return an error if there is no file', () => {

      const clonedRequest = _.cloneDeep(request);

      clonedRequest.files = [ ];

      return controller.deposit(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(noFileErrorHelperParams);
      });
    });

    it('should return an error if the mimetype is not allowed', () => {

      const clonedRequest = _.cloneDeep(request);

      clonedRequest.files = [ {
        path: 'path/to/file.xml',
        originalname: 'file.xml',
        mimetype: 'something/else'
      } ];

      return controller.deposit(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(invalidFileErrorHelperParams);
      });
    });

    it('should return an error if sendUser return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.deposit(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql(readFileParams);
        s3.upload.calledOnce.should.be.true;
        s3.upload.args[0].should.be.eql(uploadParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        s3.getUrl.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response', () => {

      return controller.deposit(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql(readFileParams);
        s3.upload.calledOnce.should.be.true;
        s3.upload.args[0].should.be.eql(uploadParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.args[0].should.be.eql([ key, guid ]);
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
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, transaction, sendParams, errorHelperParams, baseUrl, transactionWithKey, key,
      transactionWithValidKey } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transaction));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
      sandbox.stub(s3, 'getUrl', (name) => Promise.resolve(baseUrl + name));
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
        s3.getUrl.called.should.be.false;
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
        s3.getUrl.called.should.be.false;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return an error if s3.getUrl return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactionWithKey));
      s3.getUrl.restore();
      sandbox.stub(s3, 'getUrl', () => Promise.reject(responseError.error));

      return controller.approve(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response and called s3.getUrl', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactionWithValidKey));

      return controller.approve(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('reject', () => {

    const fixtures = helperFixtures.reject;
    const { request, response, messageCall, responseType, responseData, responseError,
      guid, transaction, sendParams, errorHelperParams, baseUrl, transactionWithKey, key,
      transactionWithValidKey } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transaction));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
      sandbox.stub(s3, 'getUrl', (name) => Promise.resolve(baseUrl + name));
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
        s3.getUrl.called.should.be.false;
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
        s3.getUrl.called.should.be.false;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return an error if s3.getUrl return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactionWithKey));
      s3.getUrl.restore();
      sandbox.stub(s3, 'getUrl', () => Promise.reject(responseError.error));

      return controller.reject(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response and called s3.getUrl', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactionWithValidKey));

      return controller.reject(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('createClientInvoicePayment', () => {

    const fixtures = helperFixtures.createClientInvoicePayment;
    const {
      request, response, messageCall, responseType, responseData, responseError, guid,
      invoice, sendParamsWithKey, sendParamsWithoutKey, errorHelperParams, buffer,
      readFileParams, uploadParams, invalidFileErrorHelperParams, dateErrorHelperParams
    } = fixtures;
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date(2017, 6, 3).getTime());
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(invoice));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(utils, 'readFile', () => Promise.resolve(buffer));
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
      sandbox.stub(s3, 'upload', () => Promise.resolve());
    });

    after(() => {
      clock.restore();
    });

    it('should return an error if the mimetype is not allowed', () => {

      const clonedRequest = _.cloneDeep(request);

      clonedRequest.files = [ {
        path: 'path/to/file.xml',
        originalname: 'file.xml',
        mimetype: 'something/else'
      } ];

      return controller.createClientInvoicePayment(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(invalidFileErrorHelperParams);
      });
    });

    it('should return an error if payment_date is invalid', () => {

      const clonedRequest = _.cloneDeep(request);

      clonedRequest.body.payment_date = 'invalid';

      return controller.createClientInvoicePayment(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.called.should.be.false;
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(dateErrorHelperParams);
      });
    });

    it('should return an error if sendUser return a reject', () => {
      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.createClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql(readFileParams);
        s3.upload.calledOnce.should.be.true;
        s3.upload.args[0].should.be.eql(uploadParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsWithKey);
        log.message.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response without file', () => {

      const clonedRequest = _.cloneDeep(request);

      clonedRequest.files = [ ];

      return controller.createClientInvoicePayment(clonedRequest, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.called.should.be.false;
        s3.upload.called.should.be.false;
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsWithoutKey);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response with file', () => {

      return controller.createClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        utils.readFile.calledOnce.should.be.true;
        utils.readFile.args[0].should.be.eql(readFileParams);
        s3.upload.calledOnce.should.be.true;
        s3.upload.args[0].should.be.eql(uploadParams);
        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParamsWithKey);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseData, responseType, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseData).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });

  describe('getClientInvoicePayment', () => {

    const fixtures = helperFixtures.getClientInvoicePayment;
    const {
      request, response, messageCall, responseType, responseDataWithUrl,
      responseDataWithoutUrl, responseError, guid, transactionWithKey,
      transactionWithoutKey, sendParams, errorHelperParams, s3Url, key
    } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(_.cloneDeep(transactionWithKey)));
      sandbox.stub(s3, 'getUrl', () => Promise.resolve(s3Url));
      sandbox.stub(response, 'send', () => Promise.resolve());
      sandbox.stub(errorHelper, 'handleResponse', () => Promise.resolve());
    });

    it('should return an error if send return a reject', () => {

      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.reject(responseError.error));

      return controller.getClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        s3.getUrl.called.should.be.false;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return an error if s3.getUrl return a reject', () => {

      s3.getUrl.restore();
      sandbox.stub(s3, 'getUrl', () => Promise.reject(responseError.error));

      return controller.getClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.called.should.be.false;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        response.send.called.should.be.false;
        errorHelper.handleResponse.calledOnce.should.be.true;
        errorHelper.handleResponse.args[0].should.be.eql(errorHelperParams);
      });
    });

    it('should return a successful response without url', () => {

      gateway.sendUser.restore();
      sandbox.stub(gateway, 'sendUser', () => Promise.resolve(transactionWithoutKey));

      return controller.getClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseDataWithoutUrl, responseType, guid).should.be.true;
        s3.getUrl.called.should.be.false;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseDataWithoutUrl).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });

    it('should return a successful response with url', () => {

      return controller.getClientInvoicePayment(request, response)
      .should.be.fulfilled
      .then(() => {

        gateway.sendUser.calledOnce.should.be.true;
        gateway.sendUser.args[0].should.be.eql(sendParams);
        log.message.calledOnce.should.be.true;
        log.message.calledWithMatch(messageCall, responseDataWithUrl, responseType, guid).should.be.true;
        s3.getUrl.calledOnce.should.be.true;
        s3.getUrl.calledWithMatch(key, guid).should.be.true;
        response.send.calledOnce.should.be.true;
        response.send.calledWithMatch(responseDataWithUrl).should.be.true;
        errorHelper.handleResponse.called.should.be.false;
      });
    });
  });
});
