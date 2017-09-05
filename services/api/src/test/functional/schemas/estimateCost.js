const estimateSchema = {
  required: true,
  type: 'object',
  properties: {
    total: {
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
};

module.exports = estimateSchema;
