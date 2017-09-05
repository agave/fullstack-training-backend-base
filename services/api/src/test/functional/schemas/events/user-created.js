const eventSchema = require('./event');
const userSchema = require('../user');

const body = userSchema.properties;

module.exports = eventSchema('user', 'UserCreated', body);
