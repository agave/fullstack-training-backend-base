const pendingTransactionSchema = require('./pending-transaction');

const pendingTransactionsSchema = {
  required: true,
  type: 'object',
  properties: {
    transactions: {
      required: true,
      type: 'array',
      minItems: 1,
      items: pendingTransactionSchema
    },
    balance: {
      require: true,
      type: 'number'
    }
  },
  additionalProperties: false
};

module.exports = pendingTransactionsSchema;
