const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Transfer = sequelize.define('Transfer', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
status: { type: DataTypes.ENUM('draft','waiting','ready','done','canceled'), defaultValue: 'draft' }
}, { tableName: 'transfers' });


module.exports = Transfer;