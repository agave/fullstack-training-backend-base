const errorSchema = {
  required: true,
  type: 'object',
  properties: {
    path: {
      type: 'string',
      requried: true
    },
    message: {
      type: 'string',
      required: true
    },
    data: {
      type: 'object'
    },
    code: {
      type: 'integer'
    }
  }
};

module.exports = errorSchema;
