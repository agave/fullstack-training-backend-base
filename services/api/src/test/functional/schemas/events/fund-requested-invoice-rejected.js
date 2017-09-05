const eventSchema = require('./event');

const body = {
  emails: {
    required: true,
    type: 'string'
  },
  invoice_id: {
    required: true,
    type: 'integer'
  },
  invoice_number: {
    required: true,
    type: 'string'
  },
  reason: {
    required: true,
    type: 'string'
  }
};

module.exports = eventSchema('user', 'FundRequestedInvoiceRejected', body);
