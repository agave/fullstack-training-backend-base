const _ = require('lodash');
const userSchema = require('./user');

const sessionSchema = {
  required: true,
  type: 'object',
  properties: {
    token: {
      type: 'object',
      properties: {
        token: {
          required: true,
          type: 'string'
        },
        expiration_date: {
          required: true,
          type: 'string'
        }
      },
      required: true
    },
    user: _.merge({}, userSchema, {
      properties: {
        suspended: {
          required: true,
          type: 'boolean'
        }
      }
    })
  }
};

module.exports = sessionSchema;
