const eventSchema = require('./event');

const body = {
  token: {
    required: true,
    type: 'string'
  },
  email: {
    required: true,
    type: 'string'
  },
  username: {
    required: true,
    type: 'string'
  }
};

module.exports = eventSchema('user', 'RecoverPassword', body);
