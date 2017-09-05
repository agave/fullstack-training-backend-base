const companySchema = {
  required: true,
  type: 'object',
  properties: {
    total: {
      required: true,
      type: 'number'
    },
    interest: {
      required: true,
      type: 'number'
    },
    commission: {
      required: true,
      type: 'number'
    },
    fund_total: {
      required: true,
      type: 'number'
    },
    reserve: {
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
    },
    tax_total: {
      required: true,
      type: 'number'
    }
  }
};

module.exports = companySchema;
