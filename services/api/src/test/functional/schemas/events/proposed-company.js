const eventSchema = require('./event');

const body = {
  emails: {
    required: true,
    type: 'string'
  },
  proposer_name: {
    required: true,
    type: 'string'
  },
  business_name: {
    required: true,
    type: 'string'
  },
  type: {
    required: true,
    enum: [ 'Proveedor', 'Cliente' ]
  },
  contact_name: {
    required: true,
    type: 'string'
  },
  position: {
    required: true,
    type: 'string'
  },
  email: {
    required: true,
    type: 'string'
  },
  phone: {
    required: true,
    type: 'string'
  }
};

module.exports = eventSchema('user', 'CompanyProposed', body);
