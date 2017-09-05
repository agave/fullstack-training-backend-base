const userSchema = {
  type: 'object',
  required: true,
  properties: {
    name: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
    },
    role: {
      required: true,
      type: 'string'
    },
    color: {
      required: true,
      type: 'string'
    }
  }
};

module.exports = userSchema;
