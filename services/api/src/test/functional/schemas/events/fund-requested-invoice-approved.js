const eventSchema = require('./event');

const body = {
  cxc_emails: {
    required: true,
    type: 'string'
  },
  cxp_emails: {
    required: true,
    type: 'string'
  },
  investor_emails: {
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
  invoice_expiration: {
    required: true,
    type: 'string'
  },
  invoice_company_name: {
    required: true,
    type: 'string'
  },
  cxc_payment: {
    required: true,
    type: 'integer'
  },
  bank_info: {
    required: true,
    type: 'object',
    properties: {
      holder: {
        required: true,
        type: 'string'
      },
      bank: {
        required: true,
        type: 'string'
      },
      bank_account: {
        required: true,
        type: 'string'
      },
      clabe: {
        required: true,
        type: 'string'
      }
    }
  }
};

module.exports = eventSchema('user', 'FundRequestedInvoiceApproved', body);
