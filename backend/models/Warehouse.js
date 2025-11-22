const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Warehouse = sequelize.define('Warehouse', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
location: { type: DataTypes.STRING }
}, { tableName: 'warehouses' });


module.exports = Warehouse;