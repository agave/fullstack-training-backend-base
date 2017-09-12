'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE
        },
        updated_at: {
          type: Sequelize.DATE
        }
      }
    );
  },

  down: function(queryInterface) {
    return queryInterface.dropTable('users');
  }
};
