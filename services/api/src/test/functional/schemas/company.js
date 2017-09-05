const companySchema = {
  required: true,
  type: 'object',
  properties: {
    rfc: {
      required: true,
      type: 'string'
    },
    role: {
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
    bank: {
      required: true,
      type: 'string'
    },
    bank_account: {
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
        type: 'string'
      }
    }
  }
};

module.exports = companySchema;
