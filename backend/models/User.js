const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const User = sequelize.define('User', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
email: { type: DataTypes.STRING, allowNull: false, unique: true },
passwordHash: { type: DataTypes.STRING, allowNull: false },
role: { type: DataTypes.ENUM('inventory_manager','warehouse_staff','admin'), defaultValue: 'warehouse_staff' }
}, { tableName: 'users' });


module.exports = User;