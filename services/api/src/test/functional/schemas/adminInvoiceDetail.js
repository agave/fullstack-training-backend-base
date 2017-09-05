const adminDetailSchema = require('./admin-detail');

const operationSummary = {
  fund_date: {
    required: true,
    type: 'string'
  },
  expiration: {
    required: true,
    type: 'string'
  },
  operation_term: {
    required: true,
    type: 'number'
  },
  commission: {
    required: true,
    type: 'number'
  },
  fee: {
    required: true,
    type: 'number'
  },
  earnings_fd: {
    required: true,
    type: 'number'
  }
};

const cxcPayment = {
  annual_cost: {
    required: true,
    type: 'number'
  },
  interest: {
    required: true,
    type: 'number'
  },
  interest_percentage: {
    required: true,
    type: 'number'
  },
  reserve: {
    required: true,
    type: 'number'
  },
  reserve_percentage: {
    required: true,
    type: 'number'
  },
  fd_commission: {
    required: true,
    type: 'number'
  },
  fd_commission_percentage: {
    required: true,
    type: 'number'
  },
  total: {
    required: true,
    type: 'number'
  },
  fund_payment: {
    required: true,
    type: 'number'
  },
  expiration_payment: {
    required: true,
    type: 'number'
  }
};

const investorPayment = {
  investor_name: {
    required: true,
    type: 'string'
  },
  fund_date: {
    required: true,
    type: 'string'
  },
  fund_total: {
    required: true,
    type: 'number'
  },
  earnings: {
    required: true,
    type: 'number'
  },
  earnings_percentage: {
    required: true,
    type: 'number'
  },
  gain: {
    required: true,
    type: 'number'
  },
  gain_percentage: {
    required: true,
    type: 'number'
  },
  fee: {
    required: true,
    type: 'number'
  },
  fee_percentage: {
    required: true,
    type: 'number'
  },
  isr: {
    required: true,
    type: 'number'
  },
  total_payment: {
    required: true,
    type: 'number'
  },
  include_isr: {
    required: true,
    type: 'boolean'
  }
};

const adminInvoiceDetailSchema = {
  required: true,
  type: 'object',
  properties: {
    invoice_detail: {
      required: true,
      type: 'object',
      properties: adminDetailSchema
    },
    operation_summary: {
      type: 'object',
      properties: operationSummary
    },
    cxc_payment: {
      type: 'object',
      properties: cxcPayment
    },
    investor_payment: {
      type: 'object',
      properties: investorPayment
    }
  }
};

module.exports = adminInvoiceDetailSchema;
