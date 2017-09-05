const companySchema = {
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
    expiration: {
      required: true,
      type: 'string'
    },
    number: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      type: 'string'
    },
    created_at: {
      required: true,
      type: 'string'
    },
    total: {
      required: true,
      type: 'number'
    },
    uuid: {
      required: true,
      type: 'string'
    },
    fund_date: {
      required: true,
      type: 'string'
    }
  }
};

module.exports = companySchema;
