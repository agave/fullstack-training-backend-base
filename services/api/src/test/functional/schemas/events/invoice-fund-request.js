const eventSchema = require('./event');

const body = {
  emails: {
    required: true,
    type: 'string'
  },
  invoice_number: {
    required: true,
    type: 'string'
  },
  invoice_id: {
    required: true,
    type: 'integer'
  },
  investor_name: {
    required: true,
    type: 'string'
  }
};

module.exports = eventSchema('user', 'InvoiceFundRequest', body);
