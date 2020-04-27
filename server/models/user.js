'use strict';
module.exports = (sequelize, DataTypes) => {
	
	const User = sequelize.define('User', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
		avatar: DataTypes.STRING,
		balance: DataTypes.DOUBLE(16, 8),
		depositAddress: DataTypes.STRING
	}, {});
	
	User.associate = function(models) {
		// associations can be defined here
	};
	
	User.getByUsername = function(username) {
		return User.findOne({
			where: {
				username
			}
		});
	};

	return User;
};