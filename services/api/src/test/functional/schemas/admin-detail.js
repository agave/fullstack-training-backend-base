const adminDetailSchema = {
  required: true,
  type: 'object',
  properties: {
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
      company_business_name: {
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
      client_business_name: {
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
      id: {
        required: true,
        type: 'integer'
      },
      status: {
        required: true,
        type: 'string'
      },
      total: {
        required: true,
        type: 'number'
      }
    }
  }
};

module.exports = adminDetailSchema;
