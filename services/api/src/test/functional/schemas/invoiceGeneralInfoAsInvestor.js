const invoiceSchema = {
  required: true,
  type: 'object',
  properties: {
    id: {
      required: false,
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
    business_name: {
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
    expiration: {
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
    }
  }
};

module.exports = invoiceSchema;
