const invoiceSchema = require('./invoice');

const invoicesSchema = {
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
        properties: invoiceSchema
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

module.exports = invoicesSchema;
