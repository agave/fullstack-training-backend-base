const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const producer = require('../../../api/producers/user');
const helperFixtures = require('../fixtures/producers/user');

const log = require('/var/lib/core/js/log').prototype;
const { User, Company } = require('../../../models');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/User producer', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('invitationCreated', () => {

    const fixtures = helperFixtures.invitationCreated;
    const { token, guid, companyRole, event, logMessageParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invitationCreated(token, companyRole, guid)
      .should.be.rejected
      .then(err => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invitationCreated(token, companyRole, guid)
      .should.be.fulfilled
      .then(() => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('resendInvitation', () => {

    const fixtures = helperFixtures.resendInvitation;
    const { token, guid, companyRole, event, logMessageParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.resendInvitation(token, companyRole, guid)
      .should.be.rejected
      .then(err => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.resendInvitation(token, companyRole, guid)
      .should.be.fulfilled
      .then(() => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('passwordChanged', () => {

    const fixtures = helperFixtures.passwordChanged;
    const { guid, user, event, logMessageParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.passwordChanged(user, guid)
      .should.be.rejected
      .then(err => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.passwordChanged(user, guid)
      .should.be.fulfilled
      .then(() => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('recoverPassword', () => {

    const fixtures = helperFixtures.recoverPassword;
    const { guid, token, event, logMessageParams } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.recoverPassword(token, guid)
      .should.be.rejected
      .then(err => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.recoverPassword(token, guid)
      .should.be.fulfilled
      .then(() => {
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceCreated', () => {

    const fixtures = helperFixtures.invoiceCreated;
    const { users, client, invoice, event, logMessageParams,
      guid, userQuery, companyWhere } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(Company, 'findOne', () => Promise.resolve(client));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceCreated(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        Company.findOne.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if Company.findOne fails', () => {
      const commonError = new Error('common error');

      Company.findOne.restore();
      sandbox.stub(Company, 'findOne', () => Promise.reject(commonError));

      return producer.invoiceCreated(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.calledWithMatch(companyWhere).should.be.true;
        log.message.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceCreated(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.calledWithMatch(companyWhere).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceCreated(invoice, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.calledWithMatch(companyWhere).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceApproved', () => {

    const fixtures = helperFixtures.invoiceApproved;
    const { users, client, invoice, event, logMessageParams,
      guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(invoice, 'getClient', () => Promise.resolve(client));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceApproved(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if invoice.getClient fails', () => {
      const commonError = new Error('common error');

      invoice.getClient.restore();
      sandbox.stub(invoice, 'getClient', () => Promise.reject(commonError));

      return producer.invoiceApproved(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceApproved(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceApproved(invoice, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceFundRequest', () => {

    const fixtures = helperFixtures.invoiceFundRequest;
    const { users, invoice, company, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceFundRequest(invoice, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceFundRequest(invoice, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      return producer.invoiceFundRequest(invoice, company, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceRejected', () => {

    const fixtures = helperFixtures.invoiceRejected;
    const { users, client, invoice, event, logMessageParams,
      guid, userQuery, reason } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(invoice, 'getClient', () => Promise.resolve(client));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceRejected(invoice, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if invoice.getClient fails', () => {
      const commonError = new Error('common error');

      invoice.getClient.restore();
      sandbox.stub(invoice, 'getClient', () => Promise.reject(commonError));

      return producer.invoiceRejected(invoice, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceRejected(invoice, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceRejected(invoice, reason, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('publishedInvoiceRejected', () => {

    const fixtures = helperFixtures.publishedInvoiceRejected;
    const { users, client, invoice, event, logMessageParams,
      guid, userQuery, reason } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(invoice, 'getClient', () => Promise.resolve(client));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.publishedInvoiceRejected(invoice, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.publishedInvoiceRejected(invoice, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.publishedInvoiceRejected(invoice, reason, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('fundRequestedInvoiceRejected', () => {

    const fixtures = helperFixtures.fundRequestedInvoiceRejected;
    const { users, invoice, event, logMessageParams,
      guid, userQuery, reason, investorRfc } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.fundRequestedInvoiceRejected(invoice, reason, investorRfc, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.fundRequestedInvoiceRejected(invoice, reason, investorRfc, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.fundRequestedInvoiceRejected(invoice, reason, investorRfc, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('fundRequestedInvoiceApproved', () => {

    const fixtures = helperFixtures.fundRequestedInvoiceApproved;
    const { users, invoice, event, logMessageParams, company, guid,
      cxcQuery, cxpQuery, investorQuery, adminCompanyQuery, payment } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(Company, 'findOne', () => Promise.resolve(company));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.fundRequestedInvoiceApproved(invoice, payment, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledThrice.should.be.true;
        User.findAll.args[0].should.be.eql(cxcQuery);
        User.findAll.args[1].should.be.eql(cxpQuery);
        User.findAll.args[2].should.be.eql(investorQuery);
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.args[0].should.be.eql(adminCompanyQuery);
        producer.produce.called.should.be.false;

        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.fundRequestedInvoiceApproved(invoice, payment, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledThrice.should.be.true;
        User.findAll.args[0].should.be.eql(cxcQuery);
        User.findAll.args[1].should.be.eql(cxpQuery);
        User.findAll.args[2].should.be.eql(investorQuery);
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.args[0].should.be.eql(adminCompanyQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.args[0].should.be.eql([ event ]);

        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.fundRequestedInvoiceApproved(invoice, payment, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledThrice.should.be.true;
        User.findAll.args[0].should.be.eql(cxcQuery);
        User.findAll.args[1].should.be.eql(cxpQuery);
        User.findAll.args[2].should.be.eql(investorQuery);
        Company.findOne.calledOnce.should.be.true;
        Company.findOne.args[0].should.be.eql(adminCompanyQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.args[0].should.be.eql([ event ]);
      });
    });
  });

  describe('withdrawCreated', () => {

    const fixtures = helperFixtures.withdrawCreated;
    const { users, withdraw, company, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.withdrawCreated(withdraw, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.withdrawCreated(withdraw, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      return producer.withdrawCreated(withdraw, company, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('depositCreated', () => {

    const fixtures = helperFixtures.depositCreated;
    const { users, deposit, company, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.depositCreated(deposit, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.depositCreated(deposit, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.depositCreated(deposit, company, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('pendingTransactionApproved', () => {

    const fixtures = helperFixtures.pendingTransactionApproved;
    const { users, pendingTransaction, company, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.pendingTransactionApproved(pendingTransaction, company, guid)
      .should.be.rejected
      .then(err => {
        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.pendingTransactionApproved(pendingTransaction, company, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.pendingTransactionApproved(pendingTransaction, company, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('pendingTransactionRejected', () => {

    const fixtures = helperFixtures.pendingTransactionRejected;
    const { users, pendingTransaction, reason, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.pendingTransactionRejected(pendingTransaction, reason, guid)
      .should.be.rejected
      .then(err => {
        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.pendingTransactionRejected(pendingTransaction, reason, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.pendingTransactionRejected(pendingTransaction, reason, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('clientInvoicePaymentCreated', () => {

    const fixtures = helperFixtures.clientInvoicePaymentCreated;
    const { users, amount, invoice, clientName, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.clientInvoicePaymentCreated(amount, invoice, clientName, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.clientInvoicePaymentCreated(amount, invoice, clientName, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.clientInvoicePaymentCreated(amount, invoice, clientName, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceExpired', () => {

    const fixtures = helperFixtures.invoiceExpired;
    const { users, client, invoice, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(invoice, 'getClient', () => Promise.resolve(client));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceExpired(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if invoice.getClient fails', () => {
      const commonError = new Error('common error');

      invoice.getClient.restore();
      sandbox.stub(invoice, 'getClient', () => Promise.reject(commonError));

      return producer.invoiceExpired(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceExpired(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceExpired(invoice, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        invoice.getClient.calledOnce.should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('companyRoleSuspensionUpdated', () => {

    const fixtures = helperFixtures.companyRoleSuspensionUpdated;
    const { rfc, role, suspended, users, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.companyRoleSuspensionUpdated(rfc, role, suspended, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if producer.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.companyRoleSuspensionUpdated(rfc, role, suspended, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      return producer.companyRoleSuspensionUpdated(rfc, role, suspended, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('investorRoleSuspensionUpdated', () => {

    const fixtures = helperFixtures.investorRoleSuspensionUpdated;
    const { rfc, suspended, users, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.investorRoleSuspensionUpdated(rfc, suspended, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if producer.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.investorRoleSuspensionUpdated(rfc, suspended, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      return producer.investorRoleSuspensionUpdated(rfc, suspended, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoicePaymentDue', () => {

    const fixtures = helperFixtures.invoicePaymentDue;
    const { users, invoice, event, logMessageParams, guid, userQuery } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoicePaymentDue(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoicePaymentDue(invoice, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoicePaymentDue(invoice, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceCompleted', () => {

    const fixtures = helperFixtures.invoiceCompleted;
    const {
      users, invoice, event, logMessageParams, guid, cxcQuery, investorQuery,
      cxcPayment, investorPayment
    } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceCompleted(invoice, cxcPayment, investorPayment, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceCompleted(invoice, cxcPayment, investorPayment, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceCompleted(invoice, cxcPayment, investorPayment, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceLost', () => {

    const fixtures = helperFixtures.invoiceLost;
    const { users, invoice, event, logMessageParams, guid, cxcQuery, investorQuery, cxcTransaction,
      investorTransaction } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceLost(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceLost(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceLost(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('invoiceLatePayment', () => {

    const fixtures = helperFixtures.invoiceLatePayment;
    const { users, invoice, event, logMessageParams, guid, cxcQuery, investorQuery, cxcTransaction,
      investorTransaction } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.invoiceLatePayment(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        err.should.be.equal(commonError);
      });
    });

    it('should reject if kafkaProducer.produce fails', () => {
      const produceError = new Error('produce error');

      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.invoiceLatePayment(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {
      sandbox.stub(producer, 'produce', () => Promise.resolve());

      return producer.invoiceLatePayment(invoice, cxcTransaction, investorTransaction, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledTwice.should.be.true;
        User.findAll.firstCall.args[0].should.be.eql(cxcQuery);
        User.findAll.secondCall.args[0].should.be.eql(investorQuery);
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });

  describe('companyProposed', () => {

    const fixtures = helperFixtures.companyProposed;
    const { users, event, logMessageParams, guid, userQuery, proposed, name } = fixtures;

    beforeEach(() => {
      sandbox.stub(log, 'message', () => true);
      sandbox.stub(User, 'findAll', () => Promise.resolve(users));
      sandbox.stub(producer, 'produce', () => Promise.resolve());
    });

    it('should reject if User.findAll fails', () => {
      const commonError = new Error('common error');

      User.findAll.restore();
      sandbox.stub(User, 'findAll', () => Promise.reject(commonError));

      return producer.companyProposed(proposed, name, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.called.should.be.false;
        producer.produce.called.should.be.false;
        err.should.be.equal(commonError);
      });
    });

    it('should reject if this.produce fails', () => {
      const produceError = new Error('produce error');

      producer.produce.restore();
      sandbox.stub(producer, 'produce', () => Promise.reject(produceError));

      return producer.companyProposed(proposed, name, guid)
      .should.be.rejected
      .then(err => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
        err.should.be.equal(produceError);
      });
    });

    it('should produce event correctly', () => {

      return producer.companyProposed(proposed, name, guid)
      .should.be.fulfilled
      .then(() => {

        User.findAll.calledOnce.should.be.true;
        User.findAll.calledWithMatch(userQuery).should.be.true;
        log.message.calledOnce.should.be.true;
        log.message.args[0].should.be.eql(logMessageParams);
        producer.produce.calledOnce.should.be.true;
        producer.produce.calledWithMatch(event).should.be.true;
      });
    });
  });
});
