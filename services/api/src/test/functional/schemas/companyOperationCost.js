const operationCostSchema = {
  required: true,
  type: 'object',
  properties: {
    annual_cost: {
      required: true,
      type: 'number'
    },
    reserve: {
      required: true,
      type: 'number'
    },
    fd_commission: {
      required: true,
      type: 'number'
    }
  },
  additionalProperties: false
};

module.exports = operationCostSchema;
