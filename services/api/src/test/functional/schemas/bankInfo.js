const bankInfoSchema = {
  required: true,
  type: 'object',
  properties: {
    name: {
      required: true,
      type: 'string'
    },
    account: {
      required: true,
      type: 'string'
    }
  }
};

module.exports = bankInfoSchema;
