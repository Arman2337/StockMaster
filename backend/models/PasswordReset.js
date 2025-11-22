const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const PasswordReset = sequelize.define('PasswordReset', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
email: { type: DataTypes.STRING, allowNull: false },
otp: { type: DataTypes.STRING, allowNull: false },
expiresAt: { type: DataTypes.DATE, allowNull: false },
used: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'password_resets' });


module.exports = PasswordReset;