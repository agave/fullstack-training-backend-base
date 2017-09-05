const eventSchema = require('./event');

const body = {
  email: {
    required: true,
    type: 'string'
  },
  username: {
    required: true,
    type: 'string'
  }
};

module.exports = eventSchema('user', 'PasswordChanged', body);
