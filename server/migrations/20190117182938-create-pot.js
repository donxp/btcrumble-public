'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.INTEGER
      },
      serverSecret: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hashedServerSecret: {
        allowNull: false,
        type: Sequelize.STRING
      },
      randomString: {
        allowNull: false,
        type: Sequelize.STRING
      },
      randomSignature: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      randomObject: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      finalHash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      winner: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      expiresAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Pots');
  }
};