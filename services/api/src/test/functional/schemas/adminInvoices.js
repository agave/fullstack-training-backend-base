const adminInvoicesSchema = {
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
          uuid: {
            required: true,
            type: 'string'
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
          company_rfc: {
            required: true,
            type: 'string'
          },
          company_name: {
            required: true,
            type: 'string'
          },
          company_color: {
            required: true,
            type: 'string'
          },
          investor_name: {
            type: 'string'
          },
          fund_date: {
            type: 'string'
          },
          number: {
            required: true,
            type: 'string'
          },
          total: {
            required: true,
            type: 'number'
          },
          expiration: {
            type: 'string'
          },
          status: {
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
    }
  },
  additionalProperties: false
};

module.exports = adminInvoicesSchema;
