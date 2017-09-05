const _ = require('lodash');
const userSchema = require('./user');

const deletedUserSchema = _.cloneDeep(userSchema);

deletedUserSchema.properties.company = {
  oneOf: [ userSchema.properties.company, {
    type: 'null'
  } ]
};

module.exports = deletedUserSchema;
