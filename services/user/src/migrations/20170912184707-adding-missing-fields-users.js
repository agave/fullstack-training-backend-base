'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('users',
      'password', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'password'
      }).then(() => {
        return queryInterface.addColumn(
          'users',
          'name', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'name'
          });
      });
  },

  down: function(queryInterface) {
    return queryInterface.removeColumn('users', 'password').then(() => {
      return queryInterface.removeColumn('users', 'password');
    });
  }
};
