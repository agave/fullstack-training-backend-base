const newCompanyUserSchema = {
  required: true,
  type: 'object',
  properties: {
    name: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
    },
    status: {
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

module.exports = newCompanyUserSchema;
