const userSchema = {
  type: 'object',
  required: true,
  properties: {
    id: {
      required: true,
      type: 'integer'
    },
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
    },
    company: {
      type: 'object',
      properties: {
        rfc: {
          required: true,
          type: 'string'
        },
        role: {
          required: true,
          type: 'string'
        }
      }
    }
  }
};

module.exports = userSchema;
