const investorOperationCostSchema = {
  required: true,
  type: 'object',
  properties: {
    fee: {
      required: true,
      type: 'number'
    }
  },
  additionalProperties: false
};

module.exports = investorOperationCostSchema;
