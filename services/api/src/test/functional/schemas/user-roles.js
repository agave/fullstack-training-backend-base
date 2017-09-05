const userRolesSchema = {
  type: 'array',
  required: true,
  'minItems': 2,
  items: {
    type: 'object',
    properties: {
      name: {
        required: true,
        type: 'string'
      },
      value: {
        required: true,
        type: 'string'
      }
    }
  }
};

module.exports = userRolesSchema;
