'use strict';
module.exports = (sequelize, DataTypes) => {

  const Bet = sequelize.define('Bet', {
    user_id: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE(16, 8),
    tokens: DataTypes.INTEGER,
    pot: DataTypes.INTEGER
  }, {});

  Bet.associate = function(models) {
    // associations can be defined here
    models.Bet.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });

    models.Bet.belongsTo(models.Pot, {
      foreignKey: 'pot'
    });
  };
  
  return Bet;
};