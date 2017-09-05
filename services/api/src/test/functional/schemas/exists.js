const existsSchema = {
  required: true,
  type: 'object',
  properties: {
    exists: {
      required: true,
      type: 'boolean'
    }
  }
};

module.exports = existsSchema;
