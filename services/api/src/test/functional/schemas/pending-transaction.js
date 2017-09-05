const pendingTransactionSchema = {
  required: true,
  type: 'object',
  properties: {
    id: {
      required: true,
      type: 'integer'
    },
    amount: {
      required: true,
      type: 'number',
      minimum: 0
    },
    type: {
      required: true,
      enum: [ 'withdraw', 'deposit' ]
    },
    company_rfc: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      enum: [ 'pending', 'approved', 'rejected' ]
    },
    created_at: {
      required: true,
      type: 'string'
    }
  }
};

module.exports = pendingTransactionSchema;
