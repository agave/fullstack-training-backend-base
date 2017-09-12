const Sequelize = require('sequelize');

const UserModel = {
  attributes: {
    email: {
      type: Sequelize.STRING
    }
  },
  options: {
    tableName: 'users',
    underscored: true
  }
};

module.exports = UserModel;
