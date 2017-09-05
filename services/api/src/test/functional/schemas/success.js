const tokenSchema = {
  required: true,
  type: 'object',
  properties: {
    data: {
      required: true,
      type: 'object',
      properties: {
        success: {
          required: true,
          type: 'boolean'
        }
      }
    },
    type: {
      required: true,
      type: 'string'
    }
  }
};

module.exports = tokenSchema;
