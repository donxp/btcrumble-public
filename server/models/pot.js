'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  	const Pot = sequelize.define('Pot', {
		state: DataTypes.INTEGER,
		serverSecret: DataTypes.STRING,
		hashedServerSecret: DataTypes.STRING,
		randomString: DataTypes.STRING,
		randomSignature: DataTypes.TEXT,
		randomObject: DataTypes.TEXT,
		finalHash: DataTypes.STRING,
		winner: DataTypes.INTEGER,
		expiresAt: DataTypes.DATE
  	}, {});

  	Pot.associate = function(models) {
    	models.Pot.hasMany(models.Bet, {
			as: 'Bets',
			foreignKey: 'pot'
		});
	};

	Pot.prototype.getTotalAmount = function() {
		return '0.01';
	};
	
	Pot.prototype.getTimeleft = function() {
		if(this.state == 0) return 90;
		return moment(this.expiresAt).diff(moment(), 'seconds');
	}

	Pot.prototype.isCountingDown = function() {
		return this.state >= 1;
	}

  	Pot.getCurrentPot = function() {
		return Pot.findOne({
			where: {
				[sequelize.Op.or]: [
					{state: 0},
					{state: 1}
				]
			}
		});
  	}
  	return Pot;
};