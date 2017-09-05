const tokenSchema = {
  required: true,
  type: 'object',
  properties: {
    token: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
    }
  },
  additionalProperties: false
};

module.exports = tokenSchema;
