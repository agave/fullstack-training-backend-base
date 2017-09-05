const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const API = require('../helpers/api');
const validate = require('../helpers/validate');
const _ = require('lodash');
const consumer = require('../helpers/consumer');

const errorCodes = require('../../../config/error-codes');
const fixtures = require('../fixtures/invoice');
const userFixtures = require('../fixtures/user');
const companyFixtures = require('../fixtures/company');

const errorSchema = require('../schemas/error');
const invoiceSchema = require('../schemas/invoice');
const invoicesSchema = require('../schemas/invoices');
const invoiceGeneralInfoSchema = require('../schemas/invoiceGeneralInfo');
const invoiceGeneralInfoAsInvestorSchema = require('../schemas/invoiceGeneralInfoAsInvestor');
const invoiceCreatedSchema = require('../schemas/events/invoice-created');
const invoiceApprovedSchema = require('../schemas/events/invoice-approved');
const invoiceFundRequestSchema = require('../schemas/events/invoice-fund-request');
const invoiceRejectedSchema = require('../schemas/events/invoice-rejected');
const publishedInvoiceRejectedSchema = require('../schemas/events/published-invoice-rejected');
const fundRequestedInvoiceRejectedSchema = require('../schemas/events/fund-requested-invoice-rejected');
const fundRequestedInvoiceApprovedSchema = require('../schemas/events/fund-requested-invoice-approved');
const invoiceCompletedSchema = require('../schemas/events/invoice-completed');
const lostInvoiceSchema = require('../schemas/events/lost-invoice');
const latePaymentInvoiceSchema = require('../schemas/events/invoice-late-payment');
const invoiceEstimateSchema = require('../schemas/estimateCost');
const invoiceDetailSchema = require('../schemas/invoiceDetail');
const invoiceFundEstimateSchema = require('../schemas/estimate-fund');
const marketplaceSchema = require('../schemas/marketplace');
const fundEstimateSchema = require('../schemas/investorFundEstimate');
const profitEstimateSchema = require('../schemas/investorProfitEstimate');
const investorInvoiceDetailSchema = require('../schemas/investorInvoiceDetail');
const invoiceSummarySchema = require('../schemas/invoiceSummary');
const adminInvoicesSchema = require('../schemas/adminInvoices');
const adminDetailSchema = require('../schemas/admin-detail');
const adminInvoiceDetailSchema = require('../schemas/adminInvoiceDetail');

chai.should();
chai.use(chaiAsPromised);

function getMaxTotal(invoices) {
  const max = invoices.reduce((prev, next) => {
    return prev.total > next.total ? prev : next;
  });

  return max.total;
}

describe('functional/Invoices controller', () => {

  describe('create', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const xml = fixtures.validXml();

      return API.logout()
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is admin', function() {
      const xml = fixtures.validXml();

      return API.logout()
      .then(() => API.login())
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const xml = fixtures.validXml();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const xml = fixtures.validXml();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if CXC user is suspended', function() {
      const xml = fixtures.validXml();
      const suspendedCXC = userFixtures.suspendedCXCUser();

      return API.logout()
      .then(() => API.login(suspendedCXC))
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role['Suspended company role']);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return a error if CXP company is suspended', function() {
      const xml = fixtures.validXml();
      const recipientRfc = companyFixtures.validXmlRecipientRfc();
      const suspendRequest = companyFixtures.suspendCXPRole();
      const unsuspendRequest = companyFixtures.unsuspendCXPRole();

      return API.login()
      .then(() => API.updateCompanyRoleSuspension(recipientRfc, suspendRequest))
      .then(() => consumer.getNextEvent())
      .then(() => API.cxcLogin())
      .then(() => API.uploadInvoice(xml))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Receptor is suspended']);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.login())
      .then(() => API.updateCompanyRoleSuspension(recipientRfc, unsuspendRequest))
      .then(() => consumer.getNextEvent())
      .then(() => API.logout());
    });

    it('should return error if there is no file', function() {

      return API.uploadInvoice('')
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('files');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the file is not an xml', function() {
      const notXml = fixtures.notXml();

      return API.uploadInvoice(notXml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('XML');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the file is not a valid 3.2 format', function() {
      const invalid32Xml = fixtures.invalidXml();

      return API.uploadInvoice(invalid32Xml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('XML');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the issuing company is not the same as the user', function() {
      const xml = fixtures.wrongCompany();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('company_rfc');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the recipient company does not exists', function() {
      const xml = fixtures.wrongClient();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('client_rfc');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if it is a valid invoice', function() {
      const xml = fixtures.validXml();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return consumer.getNextEvent()
        .then(validate(invoiceCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return success if it is a valid 3.3 invoice', function() {
      const xml =  fixtures.validXml(33);

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return consumer.getNextEvent()
        .then(validate(invoiceCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return a success even though stamps are too big', function() {
      const xml = fixtures.validXmlLongStamp();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        return consumer.getNextEvent()
        .then(validate(invoiceCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return error if the invoice already exists', function() {
      const xml = fixtures.validXml();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('uuid');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if client and company rfc are the same', function() {
      const xml = fixtures.sameClientCompanyRfc();

      return API.uploadInvoice(xml)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });
  });

  describe('getInvoices by CXC user', () => {

    let totalInvoices = 0;
    let invoicesList = {};

    before(() => {
      return API.cxcLogin()
      .then(() => API.getInvoices(100))
      .then(response => {
        const responseData = response.data;

        totalInvoices = responseData.data.total_invoices;
        invoicesList = _.sortBy(responseData.data.invoices, [ 'number' ]);
      });
    });

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is investor', function() {

      return API.investorLogin()
      .then(() => API.getInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of invoices with page_size limits', () => {
      return API.getInvoices(2, 0)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      return API.getInvoices(2, 0, 'email')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      return API.getInvoices(-1, 0, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page_size');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      return API.getInvoices(2, -1, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      return API.getInvoices(2, 0, 'status', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices ordered', () => {
      return API.getInvoices(2, 0, 'number', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].number.should.be.equal(invoicesList[0].number);
        responseData.data.invoices[1].number.should.be.equal(invoicesList[1].number);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered by total', () => {
      return API.getInvoices(2, 0, 'total', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].total.should.be.equal(getMaxTotal(invoicesList));
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered desc', () => {
      return API.getInvoices(2, 0, 'number', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const length = invoicesList.length;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].number.should.be.equal(invoicesList[length - 1].number);
        responseData.data.invoices[1].number.should.be.equal(invoicesList[length - 2].number);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices', () => {
      return API.getInvoices()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.not.equal(0);

        return validate(invoicesSchema)(responseData.data);
      });
    });
  });

  describe('getInvoices by CXP user', () => {

    let totalInvoices = 0;
    let invoicesList = {};

    before(() => {
      return API.cxpLogin()
      .then(() => {
        return API.getInvoices(100);
      })
      .then(response => {
        const responseData = response.data;

        totalInvoices = responseData.data.total_invoices;
        invoicesList = _.sortBy(responseData.data.invoices, [ 'number' ]);
      });
    });

    after(() => API.logout());

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is investor', function() {

      return API.investorLogin()
      .then(() => API.getInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of invoices with page_size limits', () => {
      return API.getInvoices(2, 0)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      return API.getInvoices(2, 0, 'email')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      return API.getInvoices(-1, 0, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page_size');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      return API.getInvoices(2, -1, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      return API.getInvoices(2, 0, 'status', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices ordered', () => {
      return API.getInvoices(2, 0, 'number', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].number.should.be.equal(invoicesList[0].number);
        responseData.data.invoices[1].number.should.be.equal(invoicesList[1].number);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered by total', () => {
      return API.getInvoices(2, 0, 'total', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].total.should.be.equal(getMaxTotal(invoicesList));
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered desc', () => {
      return API.getInvoices(2, 0, 'number', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const length = invoicesList.length;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].number.should.be.equal(invoicesList[length - 1].number);
        responseData.data.invoices[1].number.should.be.equal(invoicesList[length - 2].number);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices', () => {
      return API.getInvoices()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.not.equal(0);

        return validate(invoicesSchema)(responseData.data);
      });
    });
  });

  describe('getInvoice', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.getInvoice(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if invoice do not belong to the cxc user', () => {
      const invoiceId = fixtures.invalidFundEstimateId();

      return API.getInvoice(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an invoice', () => {
      const invoiceId = fixtures.validEstimateCompanyId();

      return API.getInvoice(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(invoiceGeneralInfoSchema)(responseData.data);
      });
    });


    it('should return the invoice if logged user\'s role is investor', () => {
      const invoiceId = fixtures.validMarketInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(invoiceGeneralInfoAsInvestorSchema)(responseData.data);
      })
      .then(() => API.logout());
    });

    it('should return the invoice if it is funded by the investor', () => {
      const invoiceId = fixtures.validInvoicePaymentSummary();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(invoiceGeneralInfoAsInvestorSchema)(responseData.data);
      });
    });

    it('should return not found if invoice is not published', () => {
      const invoiceId = fixtures.validEstimateCompanyId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if invoice does not exists with investor loggedIn', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoice(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });
  });

  describe('approve', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };

      return API.logout()
      .then(() => API.approve(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the expiration date is not given', function() {
      const validId = fixtures.validInvoiceId();

      return API.approve(validId, {})
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('expiration');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.approve(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };

      return API.logout()
      .then(() => API.login())
      .then(() => API.approve(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.approve(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if user is suspended', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };
      const suspendedCXP = userFixtures.suspendedCXPUser();

      return API.logout()
      .then(() => API.login(suspendedCXP))
      .then(() => API.approve(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role['Suspended company role']);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the expiration is not a date', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: 'not a date'
      };

      return API.approve(validId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('expiration');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the expiration is not a valid date', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };

      return API.approve(validId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('expiration');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();
      const nextDay = new Date();

      nextDay.setDate(nextDay.getDate() + 1);

      const data = {
        expiration: nextDay
      };

      return API.approve(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });


    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validInvoiceId();
      const nextDay = new Date();

      nextDay.setDate(nextDay.getDate() + 1);

      const data = {
        expiration: nextDay
      };

      return API.approve(validId, data)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        return consumer.getNextEvent()
        .then(validate(invoiceApprovedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });
  });

  describe('reject', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validRejectInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.reject(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const validId = fixtures.validRejectInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.reject(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validRejectInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.login())
      .then(() => API.reject(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validRejectInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.reject(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if user is suspended', function() {
      const validId = fixtures.validInvoiceId();
      const data = {
        expiration: new Date()
      };
      const suspendedCXP = userFixtures.suspendedCXPUser();

      return API.logout()
      .then(() => API.login(suspendedCXP))
      .then(() => API.reject(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role['Suspended company role']);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the reason is not given', function() {
      const validId = fixtures.validRejectInvoiceId();

      return API.reject(validId, {})
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('reason');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.reject(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validRejectInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.reject(validId, data)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        return consumer.getNextEvent()
        .then(validate(invoiceRejectedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });
  });

  describe('publish', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validPublishInvoiceId();

      return API.logout()
      .then(() => API.publish(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validPublishInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.publish(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validPublishInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.publish(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validPublishInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.publish(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if user is suspended', function() {
      const validId = fixtures.validPublishInvoiceId();
      const suspendedCXC = userFixtures.suspendedCXCUser();

      return API.logout()
      .then(() => API.login(suspendedCXC))
      .then(() => API.publish(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role['Suspended company role']);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if CXP company is suspended', function() {
      const validId = fixtures.approvedInvoiceWithSuspendedCXP();

      return API.publish(validId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('client_rfc');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Receptor is suspended']);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();

      return API.publish(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice expiration is lesser than tomorrow', function() {
      const invalidId = fixtures.invalidDateToPublishInvoiceId();

      return API.publish(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validPublishInvoiceId();

      return API.publish(validId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.published.should.not.be.empty;
        return validate(invoiceSchema)(responseData.data);
      });
    });
  });

  describe('fund', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validFundRequestInvoiceId();

      return API.logout()
      .then(() => API.fund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validFundRequestInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.fund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validFundRequestInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.fund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxc', function() {
      const validId = fixtures.validFundRequestInvoiceId();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.fund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if INVESTOR user is suspended', function() {
      const validId = fixtures.validFundRequestInvoiceId();
      const suspendedInvestor = userFixtures.suspendedInvestorUser();

      return API.logout()
      .then(() => API.login(suspendedInvestor))
      .then(() => API.fund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role['Suspended investor role']);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the invoice does not exists', function() {
      const invalidId = fixtures.invalidInvoiceId();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is not published', function() {
      const invalidId = fixtures.validInvoiceId();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is funded', function() {
      const invalidId = fixtures.validFundedInvoiceId();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invoice already funded']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is expired', function() {
      const invalidId = fixtures.validExpiredInvoiceId();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invoice has expired']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor does not have enough balance', function() {
      const invalidId = fixtures.validTooExpensiveFundRequestInvoiceId();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor gain is lower than zero', function() {
      const invalidId = fixtures.validWithAnnualCostTooCheap();

      return API.fund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const rfc = companyFixtures.validInvestorRfcWithBalance();
      const validId = fixtures.validFundRequestInvoiceId();
      let balance;

      return API.getCompanyBalance(rfc)
      .then(companyBalance => {
        balance = companyBalance.data.data.total;

        return API.fund(validId);
      })
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.fund_date.should.not.be.empty;
        responseData.data.company_rfc.should.be.empty;
        return consumer.getNextEvent()
        .then(validate(invoiceFundRequestSchema))
        .then(validate(invoiceSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        const total = fixtures.validFundRequestInvoiceTotal();

        return companyBalance.data.data.total.should.be.eql(balance - total);
      });
    });
  });

  describe('completed', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.logout()
      .then(() => API.invoiceCompleted(validId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the user role is not the correct one(cxp)', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.invoiceCompleted(validId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(cxc)', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.invoiceCompleted(validId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(investor)', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.invoiceCompleted(validId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the cxp_payment_date is not present', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest('cxp_payment_date');

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp_payment_date is invalid', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      request.cxp_payment_date = 'invalid';

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.equal('cxp_payment_date');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid cxp_payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the fondeo_payment_date is not present', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest('fondeo_payment_date');

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the fondeo_payment_date is invalid', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      request.fondeo_payment_date = 'invalid';

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.equal('fondeo_payment_date');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid fondeo_payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment is not present', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest('cxp_payment');

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment is negative', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      request.cxp_payment = -1;

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor payment is not present', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest('investor_payment');

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor payment is negative', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      request.investor_payment = -1;

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxc payment is not present', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest('cxc_payment');

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxc payment is negative', function() {
      const validId = fixtures.validPaymentInProcessId();
      const request = fixtures.validInvoiceCompletedRequest();

      request.cxc_payment = -1;

      return API.invoiceCompleted(validId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice does not exists', function() {
      const invalidId = fixtures.unexcitingInvoiceId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.invoiceCompleted(invalidId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is not payment_in_process', function() {
      const invalidId = fixtures.validFundRequestInvoiceId();
      const request = fixtures.validInvoiceCompletedRequest();

      return API.invoiceCompleted(invalidId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validPaymentInProcessId();
      const { investor_rfc } = fixtures.validPaymentInProcessInvoice();
      const request = fixtures.validInvoiceCompletedRequest();
      let expectedBalance;

      return API.getCompanyBalance(investor_rfc)
      .then(result => {

        expectedBalance = result.data.data.total + request.cxp_payment;

        return API.invoiceCompleted(validId, request);
      })
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('completed');

        return consumer.getNextEvent()
        .then(validate(invoiceCompletedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(investor_rfc))
      .then(result => result.data.data.total.should.be.equal(expectedBalance));
    });
  });

  describe('lost', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData();

      return API.logout()
      .then(() => API.lost(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the user role is not the correct one(cxp)', function() {
      const validId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.lost(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(cxc)', function() {
      const validId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.lost(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(investor)', function() {
      const validId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.lost(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the payment day is not present', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData('payment_date');

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });


    it('should return error if the cxc payment is not present', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData('cxc_payment');

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });


    it('should return error if the investor payment is not present', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData('investor_payment');

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor payment is negative', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.invalidInvoiceLostNegativeInvestorPayment();

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxc payment is negative', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.invalidInvoiceLostNegativeCxcPayment();

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the payment date is invalid', function() {
      const invalidId = fixtures.validPaymentDueInvoice();
      const data = fixtures.invalidInvoiceLostDate();

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.equal('payment_date');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice does not exists', function() {
      const invalidId = fixtures.unexcitingInvoiceId();
      const data = fixtures.validInvoiceLostData();

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is not payment due', function() {
      const invalidId = fixtures.validFundRequestInvoiceId();
      const data = fixtures.validInvoiceLostData();

      return API.lost(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validPaymentDueInvoice();
      const data = fixtures.validInvoiceLostData();

      return API.lost(validId, data)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return consumer.getNextEvent()
        .then(validate(lostInvoiceSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });
  });

  describe('latePayment', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.logout()
      .then(() => API.latePayment(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the user role is not the correct one(cxp)', function() {
      const validId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.latePayment(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(cxc)', function() {
      const validId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.latePayment(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the user role is not the correct one(investor)', function() {
      const validId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.latePayment(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the payment day is not present', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData('fondeo_payment_date');

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });


    it('should return error if the cxc payment is not present', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData('cxc_payment');

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });


    it('should return error if the investor payment is not present', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData('investor_payment');

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment is not present', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData('cxp_payment');

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment has a negative alues', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.invalidInvoiceLatePaymentNegativeCxpPayment();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment date is not present', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData('cxp_payment_date');

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxp payment date has a wrong format', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.invalidInvoiceLatePaymentCxpDate();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid cxp_payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the investor payment is negative', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.invalidInvoiceLatePaymentNegativeInvestorPayment();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the cxc payment is negative', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.invalidInvoiceLatePaymentNegativeCxcPayment();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the fonde payment date is invalid', function() {
      const invalidId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.invalidInvoiceLatePaymentDate();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.equal('fondeo_payment_date');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid fondeo_payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice does not exists', function() {
      const invalidId = fixtures.unexcitingInvoiceId();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice\'s status is not payment due', function() {
      const invalidId = fixtures.validFundRequestInvoiceId();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.latePayment(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const validId = fixtures.validPaymentDueToLatePaymentInvoice();
      const data = fixtures.validInvoiceLatePaymentData();

      return API.latePayment(validId, data)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.eql('late_payment');

        return consumer.getNextEvent()
        .then(validate(latePaymentInvoiceSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });
  });

  describe('rejectPublished', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validPublishedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.rejectPublished(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validPublishedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.rejectPublished(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validPublishedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.rejectPublished(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if the reason is not given', function() {
      const validId = fixtures.validPublishedIdToReject();

      return API.rejectPublished(validId, {})
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('reason');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.rejectPublished(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice(Admin)', function() {
      const validId = fixtures.validPublishedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.rejectPublished(validId, data)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('approved');
        return consumer.getNextEvent()
        .then(validate(publishedInvoiceRejectedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return a success if there was no issue changing the state of the invoice(Cxc)', function() {
      const validId = fixtures.validPublishedIdToRejectForCxc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.rejectPublished(validId))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('approved');
        return consumer.getNextEvent()
        .then(validate(publishedInvoiceRejectedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      })
      .then(() => API.logout());
    });

    it('should return a not found error if the invoice is not in that status', function() {
      const validId = fixtures.validPublishedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.rejectPublished(validId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });
  });

  describe('rejectFunded', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.rejectFunded(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.rejectFunded(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.rejectFunded(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.rejectFunded(validId, data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if the reason is not given', function() {
      const validId = fixtures.validFundRequestedIdToReject();

      return API.rejectFunded(validId, {})
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('reason');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();
      const data = {
        reason: 'Valid reason'
      };

      return API.rejectFunded(invalidId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue changing the state of the invoice', function() {
      const rfc = companyFixtures.validInvestorRfcWithBalanceAndPendingTransacitons();
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };
      let balance;

      return API.getCompanyBalance(rfc)
      .then(companyBalance => {
        balance = companyBalance.data.data.total;

        return API.rejectFunded(validId, data);
      }).should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('published');
        responseData.data.fund_date.should.be.empty;
        return consumer.getNextEvent()
        .then(validate(fundRequestedInvoiceRejectedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        const total = fixtures.validPendingTransactionFundToReject().amount;

        return companyBalance.data.data.total.should.be.eql(balance + total);
      });
    });

    it('should return a not found error if the invoice is not in that status', function() {
      const validId = fixtures.validFundRequestedIdToReject();
      const data = {
        reason: 'Valid reason'
      };

      return API.rejectFunded(validId, data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });
  });

  describe('approveFund', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validInvoiceIdForPendingTransaction();

      return API.logout()
      .then(() => API.approveFund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the user role is not the correct one(CXC)', function() {
      const validId = fixtures.validInvoiceIdForPendingTransaction();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.approveFund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if the user role is not the correct one(CXP)', function() {
      const validId = fixtures.validInvoiceIdForPendingTransaction();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.approveFund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if the user role is not the correct one(INVESTOR)', function() {
      const validId = fixtures.validInvoiceIdForPendingTransaction();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.approveFund(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        validate(errorSchema)(errorData.error);
        return API.logout();
      });
    });

    it('should return error if the pending transaction does not exists', function() {
      const invalidId = fixtures.unexcitingPendingTransactionId();

      return API.approveFund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('PendingTransaction');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a not found error if the invoice does not exists', function() {
      const invalidId = fixtures.unexcitingInvoiceIdForPendingTransaction();

      return API.approveFund(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a not found error if the invoice does not belongs to the investor', function() {
      const validId = fixtures.validNotRelatedToInvestorInvoiceId();

      return API.approveFund(validId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success if there was no issue accepting the fund', function() {
      const validId = fixtures.validInvoiceIdForPendingTransaction();

      return API.approveFund(validId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('funded');
        responseData.data.fund_date.should.be.empty;
        return consumer.getNextEvent()
        .then(validate(fundRequestedInvoiceApprovedSchema))
        .then(validate(adminDetailSchema)(responseData.data));
      });
    });
  });

  describe('getEstimate', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validFundEstimateInCompanyId();

      return API.logout()
      .then(() => API.getInvoiceEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validFundEstimateInCompanyId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvoiceEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validFundEstimateInCompanyId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvoiceEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validFundEstimateInCompanyId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoiceEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const validId = fixtures.unexcitingInvoiceId();

      return API.getInvoiceEstimate(validId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if invoice do not belong to the cxc user', () => {
      const invalidId = fixtures.invalidFundEstimateId();

      return API.getInvoiceEstimate(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if invoice is not approved yet', () => {
      const invalidId = fixtures.invalidMarketInvoiceId();

      return API.getInvoiceEstimate(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return operation costs', () => {
      const validId = fixtures.validEstimateCompanyId();
      const operationCost = fixtures.operationCost();

      return API.getInvoiceEstimate(validId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        responseData.data.total.should.be.equal(operationCost.total);
        responseData.data.operation_cost.should.be.equal(operationCost.operationCost);
        responseData.data.fund_total.should.be.equal(operationCost.fund_total);

        return validate(invoiceEstimateSchema)(responseData.data);
      });
    });
  });

  describe('getDetail', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getInvoiceDetail(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvoiceDetail(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvoiceDetail(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoiceDetail(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      return API.getInvoiceDetail(100000)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if invoice do not belong to the cxp user', () => {
      const invoice = fixtures.invalidInvoiceCXP();

      return API.getInvoiceDetail(invoice.id)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an invoice', () => {
      const invoice = fixtures.validInvoiceCXP();

      return API.getInvoiceDetail(invoice.id)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(invoiceDetailSchema)(responseData.data);
      });
    });

    it('should return an invoice with an expiration date', () => {
      const invoiceId = fixtures.validFundEstimateInInvoiceId();

      return API.getInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(invoiceDetailSchema)(responseData.data);
      });
    });
  });

  describe('getFundEstimate', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const validId = fixtures.validFundEstimateInInvoiceId();

      return API.logout()
      .then(() => API.getFundEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const validId = fixtures.validFundEstimateInInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getFundEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const validId = fixtures.validFundEstimateInInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.getFundEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const validId = fixtures.validFundEstimateInInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getFundEstimate(validId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if the invoice is not related to the company', function() {
      const invalidId = fixtures.invalidInvoiceId();

      return API.getFundEstimate(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.message.should.be.eql('Not found');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if invoice is not approved yet', () => {
      const invalidId = fixtures.invalidMarketInvoiceId();

      return API.getFundEstimate(invalidId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a fund estimate of a published invoice', () => {
      const validId = fixtures.validFundEstimateInInvoiceId();

      return API.getFundEstimate(validId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        const estimates = responseData.data;

        estimates.total.should.be.eql(100000);
        estimates.interest.should.be.eql(2666.67);
        estimates.commission.should.be.eql(600);
        estimates.fund_total.should.be.eql(96733.33);
        estimates.reserve.should.be.eql(11000);
        estimates.fund_payment.should.be.eql(85733.33);
        estimates.expiration_payment.should.be.eql(11000);
        estimates.tax_total.should.be.eql(160);

        return validate(invoiceFundEstimateSchema)(responseData.data);
      });
    });

    it('should return a fund estimate of an approved invoice', () => {
      const validId = fixtures.validFundEstimateInCompanyId();

      return API.getFundEstimate(validId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        const estimates = responseData.data;

        estimates.total.should.be.eql(100000);
        estimates.interest.should.be.eql(2500);
        estimates.commission.should.be.eql(500);
        estimates.fund_total.should.be.eql(97000);
        estimates.reserve.should.be.eql(10000);
        estimates.fund_payment.should.be.eql(87000);
        estimates.expiration_payment.should.be.eql(10000);
        estimates.tax_total.should.be.eql(160);

        return validate(invoiceFundEstimateSchema)(responseData.data);
      });
    });
  });

  describe('getXml', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getInvoiceXml(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvoiceXml(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvoiceXml(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoiceXml(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      return API.getInvoiceXml(100000)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if invoice do not belong to the cxp user', () => {
      const invoice = fixtures.invalidInvoiceCXP();

      return API.getInvoiceXml(invoice.id)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an invoice', () => {
      const invoice = fixtures.validInvoiceCXP();

      return API.getInvoiceXml(invoice.id)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);

        return responseData.should.be.empty;
      });
    });
  });

  describe('getMarketplace', () => {

    let totalInvoices = 0;
    let invoicesList = {};
    let filterNameList = {};
    let filterTotalList = {};

    before(() => {
      return API.investorLogin()
      .then(() => API.getMarketplace({
        page_size: 200
      }))
      .then(response => {
        const responseData = response.data;

        totalInvoices = responseData.data.total_invoices;
        invoicesList = _.sortBy(responseData.data.invoices, [ 'client_name' ]);
        filterNameList = _.filter(responseData.data.invoices, inv => {
          return inv.client_name.indexOf('plex') !== -1;
        });
        filterTotalList = _.filter(responseData.data.invoices, inv => {
          return inv.total >= 80 && inv.total <= 100;
        });
      });
    });

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getMarketplace())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getMarketplace())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getMarketplace())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of invoices with page_size limits', () => {
      const validPageSizeLimit = fixtures.validPageSizeLimit();

      return API.getMarketplace(validPageSizeLimit)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.equal(validPageSizeLimit.page_size);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      const invalidOrderBy = fixtures.invalidOrderBy();

      return API.getMarketplace(invalidOrderBy)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      const invalidPageSizeLimit = fixtures.invalidPageSizeLimit();

      return API.getMarketplace(invalidPageSizeLimit)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('page_size');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      const invalidPage = fixtures.invalidPage();

      return API.getMarketplace(invalidPage)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('page');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      const invalidOrderDesc = fixtures.invalidOrderDesc();

      return API.getMarketplace(invalidOrderDesc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices ordered', () => {
      const validOrderBy = fixtures.validOrderBy();

      return API.getMarketplace(validOrderBy)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].client_name.should.be.equal(invoicesList[0].client_name);
        responseData.data.invoices[1].client_name.should.be.equal(invoicesList[1].client_name);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered desc', () => {
      const validOrderDesc = fixtures.validOrderDesc();

      return API.getMarketplace(validOrderDesc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const length = invoicesList.length;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].client_name.should.be.equal(invoicesList[length - 1].client_name);
        responseData.data.invoices[1].client_name.should.be.equal(invoicesList[length - 1].client_name);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where client_name must to match', () => {
      const validClientName = fixtures.validClientName();

      return API.getMarketplace(validClientName)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.eql(filterNameList.length);
        responseData.data.total_invoices.should.be.equal(filterNameList.length);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where total is between min_total and max_total', () => {
      const validTotal = fixtures.validTotal();

      return API.getMarketplace(validTotal)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.eql(filterTotalList.length);
        responseData.data.total_invoices.should.be.equal(filterTotalList.length);
        responseData.data.max_total.should.be.equal(getMaxTotal(invoicesList));

        _.each(responseData.data.invoices, inv => {
          if (inv.total > 100 || inv.total < 80) {
            return Promise.reject('total requirement value is wrong');
          }
          return true;
        });

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an error if max_total has invalid value', () => {
      const invalidMaxTotal = fixtures.invalidMaxTotal();

      return API.getMarketplace(invalidMaxTotal)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('max_total');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if min_total has invalid value', () => {
      const invalidMinTotal = fixtures.invalidMinTotal();

      return API.getMarketplace(invalidMinTotal)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('min_total');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if start_date has invalid value', () => {
      const invalidStartDate = fixtures.invalidStartDate();

      return API.getMarketplace(invalidStartDate)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('start_date');
        responseData.error.code.should.be.eql(errorCodes.Marketplace['Invalid start_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if end_date has invalid value', () => {
      const invalidEndDate = fixtures.invalidEndDate();

      return API.getMarketplace(invalidEndDate)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.error.path.should.be.equal('end_date');
        responseData.error.code.should.be.eql(errorCodes.Marketplace['Invalid end_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices where expiration is between start_date and end_date', () => {
      const { uuid } = fixtures.expiredInvoice();
      const validDateRange = fixtures.validDateRange();

      return API.getMarketplace(validDateRange)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');

        const invoiceExpired = _.find(responseData.data.invoices, { uuid });

        if (invoiceExpired) {
          return Promise.reject('Invoice out of range is present');
        }

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where start_date and end_date is the same', () => {
      const endDate = fixtures.validDateRange().end_date;
      const sameDay = {
        start_date: endDate,
        end_date: endDate
      };

      return API.getMarketplace(sameDay)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.eql(1);
        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should return an array of invoices', () => {
      const maxTotal = getMaxTotal(invoicesList);

      return API.getMarketplace()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.not.equal(0);
        responseData.data.max_total.should.be.eql(maxTotal);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should not return any invoice if none match', () => {
      const maxTotal = getMaxTotal(invoicesList);
      const noOneMatchDateRange = fixtures.noOneMatchDateRange();

      return API.getMarketplace(noOneMatchDateRange)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.equal(0);

        return responseData.data.max_total.should.be.eql(maxTotal);
      });
    });

    it('should not return an expired invoice', () => {
      const { uuid } = fixtures.expiredInvoice();

      return API.getMarketplace()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.not.equal(0);

        const invoiceExpired = _.find(responseData.data.invoices, { uuid });

        if (invoiceExpired) {
          return Promise.reject('Invoice expired is present');
        }

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should not return a value with the start date', () => {
      const validExpired  = fixtures.validDateRange();

      validExpired.order_by = 'expiration';

      return API.getMarketplace(validExpired)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');

        const invoice = responseData.data.invoices[0];
        const expiration = invoice.expiration.slice(0, 15);
        const date = validExpired.start_date.toString().slice(0, 15);

        expiration.should.be.eql(date);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should not return a value with the end date', () => {
      const validExpired = fixtures.validDateRange();

      validExpired.order_by = 'expiration';
      validExpired.order_desc = true;

      return API.getMarketplace(validExpired)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');

        const invoice = responseData.data.invoices[0];
        const expiration = invoice.expiration.slice(0, 15);
        const date = validExpired.end_date.toString().slice(0, 15);

        expiration.should.be.eql(date);

        return validate(marketplaceSchema)(responseData.data);
      });
    });

    it('should not return a value with the same max and min total', () => {
      const validTotal = fixtures.validTotal();

      validTotal.order_by = 'total';

      return API.getMarketplace(validTotal)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Marketplace');
        responseData.data.invoices.length.should.be.eql(filterTotalList.length);
        responseData.data.total_invoices.should.be.equal(filterTotalList.length);

        const length = responseData.data.invoices.length - 1;
        const min = responseData.data.invoices[0];
        const max = responseData.data.invoices[length];

        min.total.should.be.eql(validTotal.min_total);
        max.total.should.be.eql(validTotal.max_total);

        return validate(marketplaceSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorFundEstimate', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxc', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.getInvestorFundEstimate(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if invoice is not published yet', () => {
      const invoiceId = fixtures.invalidMarketInvoiceId();

      return API.getInvestorFundEstimate(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return investor fund estimate(of a company)', () => {
      const invoiceId = fixtures.validMarketInvoiceId();
      const fundEstimate = fixtures.investorFundEstimate();

      return API.getInvestorFundEstimate(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.total.should.be.equal(fundEstimate.total);
        responseData.data.earnings.should.be.equal(fundEstimate.earnings);
        responseData.data.commission.should.be.equal(fundEstimate.commission);
        responseData.data.perception.should.be.equal(fundEstimate.perception);

        return validate(fundEstimateSchema)(responseData.data);
      });
    });

    it('should return investor fund estimate(of an individual)', () => {
      const credentials = userFixtures.validPhysicalInvestorUser();
      const invoiceId = fixtures.validMarketInvoiceId();
      const fundEstimate = fixtures.physicalInvestorFundEstimate();

      return API.logout()
      .then(() => API.login(credentials))
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.total.should.be.equal(fundEstimate.total);
        responseData.data.earnings.should.be.equal(fundEstimate.earnings);
        responseData.data.isr.should.be.equal(fundEstimate.isr);
        responseData.data.include_isr.should.be.true;
        responseData.data.commission.should.be.equal(fundEstimate.commission);
        responseData.data.perception.should.be.equal(fundEstimate.perception);

        return validate(fundEstimateSchema)(responseData.data);
      })
      .then(() => API.logout());
    });

    it('should return investor fund estimate on invoice fund requested(of an individual)', () => {
      const credentials = userFixtures.validPhysicalInvestorUser();
      const invoiceId = fixtures.validFundRequestedInvoice();
      const fundEstimate = fixtures.physicalInvestorFundEstimate();

      return API.logout()
      .then(() => API.login(credentials))
      .then(() => API.getInvestorFundEstimate(invoiceId))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.total.should.be.equal(fundEstimate.total);
        responseData.data.earnings.should.be.equal(fundEstimate.earnings);
        responseData.data.isr.should.be.equal(fundEstimate.isr);
        responseData.data.include_isr.should.be.true;
        responseData.data.commission.should.be.equal(fundEstimate.commission);
        responseData.data.perception.should.be.equal(fundEstimate.perception);

        return validate(fundEstimateSchema)(responseData.data);
      })
      .then(() => API.logout());
    });

    it('should return investor fund estimate on invoice fund requested(of a company)', () => {
      const invoiceId = fixtures.validMoralFundRequestedInvoice();
      const fundEstimate = fixtures.investorFundEstimate();

      return API.getInvestorFundEstimate(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.total.should.be.equal(fundEstimate.total);
        responseData.data.earnings.should.be.equal(fundEstimate.earnings);
        responseData.data.commission.should.be.equal(fundEstimate.commission);
        responseData.data.perception.should.be.equal(fundEstimate.perception);

        return validate(fundEstimateSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorProfitEstimate', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getInvestorProfitEstimate(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorProfitEstimate(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorProfitEstimate(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvestorProfitEstimate(1))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      return API.getInvestorProfitEstimate(1)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if invoice is not published yet', () => {
      const invoiceId = fixtures.invalidMarketInvoiceId();

      return API.getInvestorProfitEstimate(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return investor fund estimate', () => {
      const invoiceId = fixtures.validMarketInvoiceId();
      const profitEstimate = fixtures.investorProfitEstimate();

      return API.getInvestorProfitEstimate(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.gain.should.be.equal(profitEstimate.gain);
        responseData.data.gain_percentage.should.be.equal(profitEstimate.gain_percentage);
        responseData.data.annual_gain.should.be.equal(profitEstimate.annual_gain);

        return validate(profitEstimateSchema)(responseData.data);
      });
    });

    it('should return investor profit estimate on fund_requested invoice', () => {
      const invoiceId = fixtures.validMoralFundRequestedInvoice();
      const profitEstimate = fixtures.investorProfitEstimate();

      return API.getInvestorProfitEstimate(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.gain.should.be.equal(profitEstimate.gain);
        responseData.data.gain_percentage.should.be.equal(profitEstimate.gain_percentage);
        responseData.data.annual_gain.should.be.equal(profitEstimate.annual_gain);

        return validate(profitEstimateSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorInvoices', () => {

    let totalInvoices = 0;
    let invoicesList = [];

    before(() => {
      return API.investorLogin()
      .then(() => API.getInvestorInvoices(100))
      .then(response => {
        const responseData = response.data;

        totalInvoices = responseData.data.total_invoices;
        invoicesList = _.sortBy(responseData.data.invoices, [ 'total' ]);
      });
    });

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getInvestorInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {

      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvestorInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of invoices with page_size limits', () => {
      return API.getInvestorInvoices(2, 0)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      return API.getInvestorInvoices(2, 0, 'email')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      return API.getInvestorInvoices(-1, 0, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page_size');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      return API.getInvestorInvoices(2, -1, 'status')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      return API.getInvestorInvoices(2, 0, 'status', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices ordered by total(maxtotal)', () => {
      return API.getInvestorInvoices(2, 0, 'total', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].total.should.be.equal(getMaxTotal(invoicesList));
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered asc', () => {
      return API.getInvestorInvoices(2, 0, 'total', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].total.should.be.equal(invoicesList[0].total);
        responseData.data.invoices[1].total.should.be.equal(invoicesList[1].total);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered desc', () => {
      return API.getInvestorInvoices(2, 0, 'total', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(2);
        responseData.data.invoices[0].total.should.be.equal(invoicesList[totalInvoices - 1].total);
        responseData.data.invoices[1].total.should.be.equal(invoicesList[totalInvoices - 2].total);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(invoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices', () => {
      return API.getInvestorInvoices()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.not.equal(0);

        return validate(invoicesSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorFundDetail', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.getInvestorFundDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorFundDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxc', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorFundDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvestorFundDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.getInvestorFundDetail(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return investor fund detail on fund_requested invoice', () => {
      const invoiceId = fixtures.validMoralFundRequestedInvoice();
      const operationTerm = fixtures.validOperationTerm();

      return API.getInvestorFundDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.operation_term.should.be.equal(operationTerm);

        return validate(investorInvoiceDetailSchema)(responseData.data);
      });
    });
  });

  describe('getInvoicePaymentSummary', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxcLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.getInvoicePaymentSummary(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvoicePaymentSummary(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is admin', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.login())
      .then(() => API.getInvoicePaymentSummary(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvoicePaymentSummary(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.getInvoicePaymentSummary(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return invoice summary detail if it is a valid invoice', () => {
      const invoiceId = fixtures.validInvoicePaymentSummary();
      const summary = fixtures.validInvoiceSummary();

      return API.getInvoicePaymentSummary(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.payment_summary.should.be.deep.equal(summary.payment_summary);
        responseData.data.financial_summary.should.be.deep.equal(summary.financial_summary);

        return validate(invoiceSummarySchema)(responseData.data);
      });
    });
  });

  describe('getAdminInvoices', () => {

    const pageSize = 500;
    let invoicesList = {};
    let totalInvoices = 0;
    let filterClientNameList = [];
    let filterCompanyNameList = [];
    let filterInvestorNameList = [];
    let filterStatusList = [];

    before(() => {
      return API.login()
      .then(() => API.getAdminInvoices({
        page_size: pageSize
      }))
      .then(response => {
        const responseData = response.data;
        const { company_name } = fixtures.validCompanyName();
        const { client_name } = fixtures.validClientName();
        const { investor_name } = fixtures.validInvestorName();
        const { status } = fixtures.validStatusArray();

        totalInvoices = responseData.data.total_invoices;
        invoicesList = _.sortBy(responseData.data.invoices, [ 'client_name' ]);
        filterClientNameList = _.filter(responseData.data.invoices, inv => {
          return inv.client_name.indexOf(client_name) !== -1;
        });
        filterCompanyNameList = _.filter(responseData.data.invoices, inv => {
          return inv.company_name.indexOf(company_name) !== -1;
        });
        filterInvestorNameList = _.filter(responseData.data.invoices, inv => {
          return inv.investor_name && inv.investor_name.indexOf(investor_name) !== -1;
        });
        filterStatusList = _.filter(responseData.data.invoices, inv => {
          return inv.status.indexOf(status[0]) !== -1 || inv.status.indexOf(status[1]) !== -1;
        });
      });
    });

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getAdminInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getAdminInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getAdminInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getAdminInvoices())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of invoices with page_size limits', () => {
      const request = fixtures.validPageSizeLimit();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(request.page_size);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      const request = fixtures.invalidOrderBy();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      const request = fixtures.invalidPageSizeLimit();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page_size');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      const request = fixtures.invalidPage();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('page');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      const request = fixtures.invalidOrderDesc();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices ordered', () => {
      const request = fixtures.validOrderBy();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const lastIndex = invoicesList.length - 1;
        const firstInvoice = invoicesList[0];
        const lastInvoice = invoicesList[lastIndex];

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(invoicesList.length);
        responseData.data.invoices[0].client_name.should.be.equal(firstInvoice.client_name);
        responseData.data.invoices[lastIndex].client_name.should.be.equal(lastInvoice.client_name);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices ordered desc', () => {
      const request = fixtures.validOrderDesc();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const lastIndex = invoicesList.length - 1;
        const firstInvoice = invoicesList[0];
        const lastInvoice = invoicesList[lastIndex];

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(invoicesList.length);
        responseData.data.invoices[0].client_name.should.be.equal(lastInvoice.client_name);
        responseData.data.invoices[lastIndex].client_name.should.be.equal(firstInvoice.client_name);
        responseData.data.total_invoices.should.be.equal(totalInvoices);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices', () => {
      return API.getAdminInvoices({ page_size: fixtures.totalInvoicesCount() })
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(invoicesList.length);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where client_name must to match', () => {
      const request = fixtures.validClientName();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(filterClientNameList.length);
        responseData.data.total_invoices.should.be.equal(filterClientNameList.length);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where company_name must to match', () => {
      const request = fixtures.validCompanyName();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(filterCompanyNameList.length);
        responseData.data.total_invoices.should.be.equal(filterCompanyNameList.length);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices where investor_name must to match', () => {
      const request = fixtures.validInvestorName();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(filterInvestorNameList.length);
        responseData.data.total_invoices.should.be.equal(filterInvestorNameList.length);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an array of invoices filtered by status', () => {
      const request = fixtures.validStatusArray();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.data.invoices.length.should.be.equal(filterStatusList.length);
        responseData.data.total_invoices.should.be.equal(filterStatusList.length);

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an error if the status field isn\'t allowed', () => {
      const request = fixtures.invalidStatusArray();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('status');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if start_fund_date has invalid value', () => {
      const request = fixtures.invalidFundStartDate();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('start_fund_date');
        responseData.error.code.should.be.eql(errorCodes.InvoiceList['Invalid start_fund_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if end_fund_date has invalid value', () => {
      const request = fixtures.invalidFundEndDate();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('end_fund_date');
        responseData.error.code.should.be.eql(errorCodes.InvoiceList['Invalid end_fund_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices where fund date is between start_fund_date and end_fund_date', () => {
      const { uuid } = fixtures.yesterdayFundRequestInvoice();
      const request = fixtures.validFundDateRange();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');

        const olderInvoice = _.find(responseData.data.invoices, { uuid });

        if (olderInvoice) {
          return Promise.reject('Invoice out of range is present');
        }

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });

    it('should return an error if start_expiration_date has invalid value', () => {
      const request = fixtures.invalidExpirationStartDate();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('start_expiration_date');
        responseData.error.code.should.be.eql(errorCodes.InvoiceList['Invalid start_expiration_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if end_expiration_date has invalid value', () => {
      const request = fixtures.invalidExpirationEndDate();

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');
        responseData.error.path.should.be.equal('end_expiration_date');
        responseData.error.code.should.be.eql(errorCodes.InvoiceList['Invalid end_expiration_date']);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of invoices between start_expiration_date and end_expiration_date', () => {
      const { uuid } = fixtures.expiredInvoice();
      const request = fixtures.validExpirationDateRange();

      request.page_size = pageSize;

      return API.getAdminInvoices(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvoiceList');

        const olderInvoice = _.find(responseData.data.invoices, { uuid });

        if (olderInvoice) {
          return Promise.reject('Invoice out of range is present');
        }

        return validate(adminInvoicesSchema)(responseData.data);
      });
    });
  });

  describe('getInvoiceDetailAsAdmin', () => {

    before(() => {
      return API.logout();
    });

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxp', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxc', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is not allowed', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is not allowed', function() {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getAdminInvoiceDetail(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found if invoice does not exists', () => {
      const invoiceId = fixtures.unexcitingInvoiceId();

      return API.getAdminInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return invoice detail on pending invoice', () => {
      const invoiceId = fixtures.validAdminInvoiceDetailWithoutExpirationDate();

      return API.getAdminInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(adminInvoiceDetailSchema)(responseData.data);
      });
    });

    it('should return invoice detail on approved invoice', () => {
      const invoiceId = fixtures.validApprovedInvoice();

      return API.getAdminInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');

        return validate(adminInvoiceDetailSchema)(responseData.data);
      });
    });

    it('should return invoice detail on published invoice', () => {
      const invoiceId = fixtures.validAdminInvoiceDetailWithoutInvestor();

      return API.getAdminInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.operation_summary.should.not.be.null;
        responseData.data.cxc_payment.should.not.be.null;

        return validate(adminInvoiceDetailSchema)(responseData.data);
      });
    });

    it('should return invoice detail on fund_requested invoice', () => {
      const invoiceId = fixtures.validMoralFundRequestedInvoice();

      return API.getAdminInvoiceDetail(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.operation_summary.should.not.be.null;
        responseData.data.cxc_payment.should.not.be.null;
        responseData.data.investor_payment.should.not.be.null;

        return validate(adminInvoiceDetailSchema)(responseData.data);
      });
    });
  });
});
