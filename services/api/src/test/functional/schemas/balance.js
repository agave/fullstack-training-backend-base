const balanceSchema = {
  required: true,
  type: 'object',
  properties: {
    total: {
      required: true,
      type: 'number',
      minimum: 0
    }
  }
};

module.exports = balanceSchema;
