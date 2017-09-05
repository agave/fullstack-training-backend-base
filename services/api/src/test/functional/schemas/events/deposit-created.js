const eventSchema = require('./event');

const body = {
  emails: {
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
  }
};

module.exports = eventSchema('user', 'DepositCreated', body);
