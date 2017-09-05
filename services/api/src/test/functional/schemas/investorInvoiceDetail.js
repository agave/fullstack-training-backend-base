const investorInvoiceDetailSchema = {
  required: true,
  type: 'object',
  properties: {
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
    }
  },
  additionalProperties: false
};

module.exports = investorInvoiceDetailSchema;
