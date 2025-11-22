const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Warehouse = require('./Warehouse');


const StockLocation = sequelize.define('StockLocation', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'stock_locations' });


StockLocation.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(StockLocation, { foreignKey: 'warehouseId' });


module.exports = StockLocation;