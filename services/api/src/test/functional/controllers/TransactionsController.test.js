const _ = require('lodash');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const API = require('../helpers/api');
const validate = require('../helpers/validate');
const consumer = require('../helpers/consumer');

const errorCodes = require('../../../config/error-codes');
const fixtures = require('../fixtures/transaction');
const userFixtures = require('../fixtures/user');
const companyFixtures = require('../fixtures/company');
const invoiceFixtures = require('../fixtures/invoice');

const errorSchema = require('../schemas/error');
const pendingTransactionSchema = require('../schemas/pending-transaction');
const withdrawCreatedSchema = require('../schemas/events/withdraw-created');
const depositCreatedSchema = require('../schemas/events/deposit-created');
const pendingTransactionsSchema = require('../schemas/pending-transactions');
const pendingTransactionApprovedSchema = require('../schemas/events/pending-transaction-approved');
const PendingTransactionRejectedSchema = require('../schemas/events/pending-transaction-rejected');
const clientInvoicePaymentCreatedSchema = require('../schemas/events/client-invoice-payment-created');
const invoiceSchema = require('../schemas/invoice');

const should = chai.should();

chai.use(chaiAsPromised);

describe('functional/Transactions controller', () => {


  describe('withdraw', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const request = fixtures.validWithdrawRequest();

      return API.logout()
      .then(() => API.withdraw(request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the user role is cxc', function() {
      const request = fixtures.validWithdrawRequest();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.withdraw(request))
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

    it('should return error if the user role is cxp', function() {
      const request = fixtures.validWithdrawRequest();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.withdraw(request))
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

    it('should return error if the user role is admin', function() {
      const request = fixtures.validWithdrawRequest();

      return API.logout()
      .then(() => API.login())
      .then(() => API.withdraw(request))
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

    it('should return error if the amount is not present', function() {
      return API.withdraw()
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the amount is invalid', function() {
      const request = fixtures.negativeWithdrawRequest();

      return API.withdraw(request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the company has insufficient balance', function() {
      const request = fixtures.validWithdrawRequest();
      const zeroBalanceInvestor = userFixtures.zeroBalanceInvestor();

      return API.login(zeroBalanceInvestor)
      .then(() => API.withdraw(request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('Transaction');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return a success if withdraw request was created successfully', function() {
      const request = fixtures.validWithdrawRequest();

      return API.withdraw(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        return consumer.getNextEvent()
        .then(validate(withdrawCreatedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      });
    });
  });

  describe('getPendingTransactions', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const { rfc } = companyFixtures.validInvestorWithPendingTransactions();

      return API.logout()
      .then(() => API.getPendingTransactions(rfc))
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
      const { rfc } = companyFixtures.validInvestorWithPendingTransactions();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getPendingTransactions(rfc))
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
      const { rfc } = companyFixtures.validInvestorWithPendingTransactions();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getPendingTransactions(rfc))
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
      const { rfc } = companyFixtures.validInvestorWithPendingTransactions();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getPendingTransactions(rfc))
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

    it('should return an array of investor\'s pending transactions', () => {
      const { rfc, transactions } = companyFixtures.validInvestorWithPendingTransactions();

      return API.getPendingTransactions(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('TransactionList');
        responseData.data.transactions.length.should.be.equal(transactions.length);

        return validate(pendingTransactionsSchema)(responseData.data);
      });
    });

    it('should return an array of company\'s pending transactions', () => {
      const { rfc, transactions } = companyFixtures.validCompanyWithPendingTransactions();

      return API.getPendingTransactions(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('TransactionList');
        responseData.data.transactions.length.should.be.equal(transactions.length);

        return validate(pendingTransactionsSchema)(responseData.data);
      });
    });
  });

  describe('deposit', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.investorLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const deposit = fixtures.validDeposit();

      return API.logout()
      .then(() => API.deposit(deposit))
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
      const deposit = fixtures.validDeposit();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.deposit(deposit))
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
      const deposit = fixtures.validDeposit();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.deposit(deposit))
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
      const deposit = fixtures.validDeposit();

      return API.logout()
      .then(() => API.login())
      .then(() => API.deposit(deposit))
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

    it('should return error if INVESTOR is suspended', function() {
      const deposit = fixtures.validDeposit();
      const suspendedInvestor = userFixtures.suspendedInvestorUser();

      return API.logout()
      .then(() => API.login(suspendedInvestor))
      .then(() => API.deposit(deposit))
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

    it('should return error if the amount is not included', function() {
      const deposit = _.cloneDeep(fixtures.validDeposit());

      delete deposit.amount;

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the amount is not a number', function() {
      const deposit = _.cloneDeep(fixtures.validDeposit());

      deposit.amount = 'Not a number';

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the amount is not positive', function() {
      const deposit = _.cloneDeep(fixtures.validDeposit());

      deposit.amount = -1;

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the deposit_date is not included', function() {
      const deposit = _.cloneDeep(fixtures.validDeposit());

      delete deposit.deposit_date;

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('deposit_date');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the receipt is not included', function() {
      const deposit = _.cloneDeep(fixtures.validDeposit());

      delete deposit.file;

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('receipt');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the receipt is not a valid format', function() {
      const deposit = fixtures.invalidReceipt();

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('receipt');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success wiht a JPG', function() {
      const deposit = fixtures.validDeposit();

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        return consumer.getNextEvent()
        .then(validate(depositCreatedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      });
    });

    it('should return a success wiht a PNG', function() {
      const deposit = fixtures.validDeposit('PNG');

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        return consumer.getNextEvent()
        .then(validate(depositCreatedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      });
    });

    it('should return a success wiht a PDF', function() {
      const deposit = fixtures.validDeposit('PDF');

      return API.deposit(deposit)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        return consumer.getNextEvent()
        .then(validate(depositCreatedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      });
    });
  });

  describe('approveTransaction', () => {

    let balance;

    beforeEach(function() {
      return API.login()
      .then(() => {
        const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();

        return API.getCompanyBalance(rfc);
      })
      .then(companyBalance => {
        balance = companyBalance.data.data.total;
      });
    });

    it('should return error if not authenticated', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.approveTransaction(request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is investor', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.approveTransaction(request))
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

    it('should return error if role is cxc', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.approveTransaction(request))
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

    it('should return error if role is cxp', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.approveTransaction(request))
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

    it('should return not found if pendingTransaction\'s status is different than pending', () => {
      const request = fixtures.approvedPendingTransaction();

      return API.approveTransaction(request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an approved pending deposit transaction', () => {
      const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();
      const request = fixtures.pendingDepositTransaction();

      return API.approveTransaction(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        responseData.data.status.should.be.equal('approved');

        return consumer.getNextEvent()
        .then(validate(pendingTransactionApprovedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        return companyBalance.data.data.total.should.be.eql(balance + 300);
      });
    });

    it('should return error if the company has insufficient balance', () => {
      const request = fixtures.pendingInvalidWithdrawTransaction();

      return API.approveTransaction(request.id)
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('PendingTransaction');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an approved pending withdraw transaction', () => {
      const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();
      const request = fixtures.pendingWithdrawTransaction();

      return API.approveTransaction(request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        responseData.data.status.should.be.equal('approved');

        return consumer.getNextEvent()
        .then(validate(pendingTransactionApprovedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        return companyBalance.data.data.total.should.be.eql(balance);
      });
    });
  });

  describe('rejectTransaction', () => {

    let balance;

    beforeEach(function() {
      return API.login()
      .then(() => {
        const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();

        return API.getCompanyBalance(rfc);
      })
      .then(companyBalance => {
        balance = companyBalance.data.data.total;
      });
    });

    const body = fixtures.reason();

    it('should return error if not authenticated', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.rejectTransaction(request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is investor', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.rejectTransaction(request))
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

    it('should return error if role is cxc', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.rejectTransaction(request))
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

    it('should return error if role is cxp', () => {
      const request = fixtures.invalidPendingTransaction();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.rejectTransaction(request))
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

    it('should return not found if pendingTransaction\'s status is different than pending', () => {
      const request = fixtures.approvedPendingTransaction();

      return API.rejectTransaction(request, body)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the reason is not present', function() {
      const pendingTransaction = fixtures.pendingDepositTransactionToReject();

      return API.rejectTransaction(pendingTransaction.id)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('reason');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a rejected pending transaction', () => {
      const pendingTransaction = fixtures.pendingDepositTransactionToReject();
      const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();

      return API.rejectTransaction(pendingTransaction.id, body)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        responseData.data.status.should.be.equal('rejected');

        return consumer.getNextEvent()
        .then(validate(PendingTransactionRejectedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        return companyBalance.data.data.total.should.be.eql(balance);
      });
    });

    it('should return a rejected pending transaction and restore the balance', () => {
      const pendingTransaction = fixtures.pendingWithdrawTransactionToReject();
      const { rfc } = companyFixtures.validCompanyWithBalancePendingWithdraw();

      return API.rejectTransaction(pendingTransaction.id, body)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        responseData.data.status.should.be.equal('rejected');

        return consumer.getNextEvent()
        .then(validate(PendingTransactionRejectedSchema))
        .then(validate(pendingTransactionSchema)(responseData.data));
      })
      .then(() => API.getCompanyBalance(rfc))
      .then(companyBalance => {
        return companyBalance.data.data.total.should.be.eql(balance + pendingTransaction.amount);
      });
    });
  });

  describe('createClientInvoicePayment', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.cxpLogin();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.validClientInvoicePayment();

      return API.logout()
      .then(() => API.createClientInvoicePayment(invoiceId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if user is cxc', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.validClientInvoicePayment();

      return API.cxcLogin()
      .then(() => API.createClientInvoicePayment(invoiceId, request))
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

    it('should return error if user is investor', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.validClientInvoicePayment();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.createClientInvoicePayment(invoiceId, request))
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

    it('should return error if the amount is not included', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = _.cloneDeep(fixtures.validClientInvoicePayment());

      delete request.amount;

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the amount is not a number', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = _.cloneDeep(fixtures.validClientInvoicePayment());

      request.amount = 'Not a number';

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the amount is not positive', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = _.cloneDeep(fixtures.validClientInvoicePayment());

      request.amount = -1;

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('amount');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the payment_date is not included', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = _.cloneDeep(fixtures.validClientInvoicePayment());

      delete request.payment_date;

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('payment_date');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the payment_date is invalid', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = _.cloneDeep(fixtures.validClientInvoicePayment());

      request.payment_date = 'invalid';

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('payment_date');
        errorData.error.code.should.be.eql(errorCodes.Invoice['Invalid payment_date']);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the receipt is not a valid format', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.invalidClientInvoicePaymentReceipt();

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('receipt');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if invoice does not exist', function() {
      const invoiceId = invoiceFixtures.unexcitingInvoiceId();
      const request = fixtures.validClientInvoicePayment();

      return API.createClientInvoicePayment(invoiceId, request)
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

    it('should return error if invoice in not in FUNDED state', function() {
      const invoiceId = invoiceFixtures.validFundRequestInvoiceId();
      const request = fixtures.validClientInvoicePayment();

      return API.createClientInvoicePayment(invoiceId, request)
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

    it('should return error if invoice does not belong to cxp user', function() {
      const cxpUser = userFixtures.validCxpUser2();
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.validClientInvoicePayment();

      return API.login(cxpUser)
      .then(() => API.createClientInvoicePayment(invoiceId, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Invoice');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return a success without a receipt', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithoutReceipt();
      const request = fixtures.validClientInvoicePayment();

      delete request.file;

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('payment_in_process');
        return consumer.getNextEvent()
        .then(validate(clientInvoicePaymentCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return a success with a JPG', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithJPGReceipt();
      const request = fixtures.validClientInvoicePayment();

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('payment_in_process');
        return consumer.getNextEvent()
        .then(validate(clientInvoicePaymentCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return a success with a PNG', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithPNGReceipt();
      const request = fixtures.validClientInvoicePayment('PNG');

      return API.createClientInvoicePayment(invoiceId, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('payment_in_process');
        return consumer.getNextEvent()
        .then(validate(clientInvoicePaymentCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });

    it('should return a success with a PDF as admin', function() {
      const invoiceId = invoiceFixtures.validFundedInvoiceIdToPayWithPDFReceipt();
      const request = fixtures.validClientInvoicePayment('PDF');

      return API.login()
      .then(() => API.createClientInvoicePayment(invoiceId, request))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Invoice');
        responseData.data.status.should.be.equal('payment_in_process');
        return consumer.getNextEvent()
        .then(validate(clientInvoicePaymentCreatedSchema))
        .then(validate(invoiceSchema)(responseData.data));
      });
    });
  });

  describe('getClientInvoicePayment', () => {

    beforeEach(() => {
      if (!API.isLoggedIn()) {
        return API.login();
      }

      return Promise.resolve();
    });

    it('should return error if not authenticated', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithReceipt();

      return API.logout()
      .then(() => API.getClientInvoicePayment(invoiceId))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if user is cxc', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithReceipt();

      return API.cxcLogin()
      .then(() => API.getClientInvoicePayment(invoiceId))
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

    it('should return error if user is cxp', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithReceipt();

      return API.cxpLogin()
      .then(() => API.getClientInvoicePayment(invoiceId))
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

    it('should return error if user is investor', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithReceipt();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getClientInvoicePayment(invoiceId))
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

    it('should return error if invoice does not exist', function() {
      const invoiceId = invoiceFixtures.unexcitingInvoiceId();

      return API.getClientInvoicePayment(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if invoice is not in PAYMENT_IN_PROCESS state', function() {
      const invoiceId = invoiceFixtures.validFundRequestInvoiceId();

      return API.getClientInvoicePayment(invoiceId)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Transaction');
        errorData.error.path.should.be.eql('Invoice');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a success with receipt', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithReceipt();

      return API.getClientInvoicePayment(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        should.exist(responseData.data.data.url);

        return validate(pendingTransactionSchema)(responseData.data);
      });
    });

    it('should return a success without receipt', function() {
      const invoiceId = invoiceFixtures.validPaymentInProcessInvoiceIdWithoutReceipt();

      return API.getClientInvoicePayment(invoiceId)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Transaction');
        should.not.exist(response.data.data.url);

        return validate(pendingTransactionSchema)(responseData.data);
      });
    });
  });
});
