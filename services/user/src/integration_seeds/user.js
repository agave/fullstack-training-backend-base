const { User } = require('../models');
const data = require('/var/lib/core/integration_fixtures/user');

module.exports = {
  run: () => User.bulkCreate(data)
};
