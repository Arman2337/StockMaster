const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');


const Receipt = sequelize.define('Receipt', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
supplier: { type: DataTypes.STRING },
status: { type: DataTypes.ENUM('draft','waiting','ready','done','canceled'), defaultValue: 'draft' }
}, { tableName: 'receipts' });


Receipt.belongsTo(User, { foreignKey: 'createdBy' });


module.exports = Receipt;