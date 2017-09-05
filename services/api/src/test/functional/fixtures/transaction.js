const _ = require('lodash');
const factory = require('../factories/transaction');
const pendingTransactionFixtures = require('/var/lib/core/integration_fixtures/pendingTransaction');

const today = new Date();

class TransactionFixtures {
  validWithdrawRequest() {
    return factory.createWithdraw(100);
  }

  negativeWithdrawRequest() {
    return factory.createWithdraw(-100);
  }

  validDeposit(type = 'JPG') {
    return {
      file: factory['valid' + type](),
      amount: 1000,
      deposit_date: today.toString()
    };
  }

  invalidReceipt() {
    return {
      file: factory.invalidFile(),
      amount: 1000,
      deposit_date: today.toString()
    };
  }

  validClientInvoicePayment(type = 'JPG') {
    return {
      file: factory['valid' + type](),
      amount: 1000,
      payment_date: today.toString()
    };
  }

  invalidClientInvoicePaymentReceipt() {
    return {
      file: factory.invalidFile(),
      amount: 1000,
      payment_date: today.toString()
    };
  }

  invalidPendingTransaction() {
    return 1;
  }

  approvedPendingTransaction() {
    return 50001;
  }

  pendingDepositTransaction() {
    return 50000;
  }

  pendingWithdrawTransaction() {
    return 50002;
  }
  pendingDepositTransactionToReject() {
    return _.find(pendingTransactionFixtures, { id: 50003 });
  }
  pendingWithdrawTransactionToReject() {
    return _.find(pendingTransactionFixtures, { id: 50004 });
  }
  pendingInvalidWithdrawTransaction() {
    return _.find(pendingTransactionFixtures, { id: 50005 });
  }

  reason() {
    return {
      reason: 'A problem'
    };
  }
}

module.exports = new TransactionFixtures();
