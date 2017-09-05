const summarySchema = {
  required: true,
  type: 'object',
  properties: {
    payment_summary: {
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
        operation_cost: {
          required: true,
          type: 'number'
        },
        fund_total: {
          required: true,
          type: 'number'
        }
      },
      additionalProperties: false
    },
    financial_summary: {
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
        },
        gain: {
          required: true,
          type: 'number'
        },
        gain_percentage: {
          required: true,
          type: 'number'
        },
        annual_gain: {
          required: true,
          type: 'number'
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};

module.exports = summarySchema;
