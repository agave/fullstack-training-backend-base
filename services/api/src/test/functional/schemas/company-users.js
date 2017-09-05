const newCompanyUserSchema = require('./new-company-user');

const companyUsersSchema = {
  required: true,
  type: 'object',
  properties: {
    users: {
      required: true,
      'minItems': 1,
      items: newCompanyUserSchema
    }
  }
};

module.exports = companyUsersSchema;
