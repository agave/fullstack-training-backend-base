const eventSchema = require('./event');

const body = {
  cxc_emails: {
    required: true,
    type: 'string'
  },
  investor_emails: {
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
  cxc_payment: {
    required: true,
    type: 'number'
  },
  investor_payment: {
    required: true,
    type: 'number'
  }
};

module.exports = eventSchema('user', 'InvoiceLatePayment', body);
