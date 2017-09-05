const marketplaceSchema = {
  required: true,
  type: 'object',
  properties: {
    invoices: {
      required: true,
      type: 'array',
      minItems: 1,
      items: {
        required: true,
        type: 'object',
        properties: {
          id: {
            required: true,
            type: 'integer'
          },
          client_rfc: {
            required: true,
            type: 'string'
          },
          client_name: {
            required: true,
            type: 'string'
          },
          client_color: {
            required: true,
            type: 'string'
          },
          published: {
            required: true,
            type: 'string'
          },
          total: {
            required: true,
            type: 'number'
          },
          expiration: {
            required: true,
            type: 'string'
          },
          status: {
            required: true,
            type: 'string'
          },
          uuid: {
            required: true,
            type: 'string'
          }
        },
        additionalProperties: false
      }
    },
    total_invoices: {
      required: true,
      type: 'integer'
    },
    total_pages: {
      required: true,
      type: 'integer'
    },
    max_total: {
      required: true,
      type: 'number'
    }
  },
  additionalProperties: false
};

module.exports = marketplaceSchema;
