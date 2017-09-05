const invoiceSchema = {
  required: true,
  type: 'object',
  properties: {
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
    business_name: {
      required: true,
      type: 'string'
    },
    company_regime: {
      required: true,
      type: 'string'
    },
    company_postal_code: {
      required: true,
      type: 'string'
    },
    number: {
      required: true,
      type: 'string'
    },
    emission_date: {
      required: true,
      type: 'string'
    },
    uuid: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      type: 'string'
    },
    subtotal: {
      required: true,
      type: 'number'
    },
    taxes: {
      required: true,
      type: 'number'
    },
    total: {
      required: true,
      type: 'number'
    },
    cadena_original: {
      required: true,
      type: 'string'
    },
    sat_digital_stamp: {
      required: true,
      type: 'string'
    },
    cfdi_digital_stamp: {
      required: true,
      type: 'string'
    },
    expiraiton: {
      type: 'string'
    },
    items: {
      required: true,
      type: 'array',
      items: {
        required: true,
        type: 'object',
        properties: {
          count: {
            required: true,
            type: 'string'
          },
          description: {
            required: true,
            type: 'string'
          },
          price: {
            required: true,
            type: 'string'
          },
          total: {
            required: true,
            type: 'string'
          }
        }
      }
    }
  }
};

module.exports = invoiceSchema;
