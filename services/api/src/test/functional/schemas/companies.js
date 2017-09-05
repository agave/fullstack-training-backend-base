const companiesSchema = {
  required: true,
  type: 'object',
  properties: {
    companies: {
      required: true,
      type: 'array',
      minItems: 1,
      items: {
        required: true,
        type: 'object',
        properties: {
          rfc: {
            required: true,
            type: 'string'
          },
          name: {
            required: true,
            type: 'string'
          },
          business_name: {
            required: true,
            type: 'string'
          },
          holder: {
            required: true,
            type: 'string'
          },
          clabe: {
            required: true,
            type: 'string'
          },
          color: {
            required: true,
            type: 'string'
          },
          suspended_roles: {
            required: true,
            type: 'array',
            items: {
              type: 'string',
              enum: [ 'CXC', 'CXP', 'INVESTOR' ]
            }
          },
          user_count: {
            required: true,
            type: 'integer'
          },
          invitation_count: {
            required: true,
            type: 'integer'
          }
        },
        additionalProperties: false
      }
    },
    total_companies: {
      required: true,
      type: 'integer'
    },
    total_pages: {
      required: true,
      type: 'integer'
    }
  },
  additionalProperties: false
};

module.exports = companiesSchema;
