const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const StockLocation = require('./StockLocation');


const Stock = sequelize.define('Stock', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
quantity: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName: 'stocks' });


Stock.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Stock, { foreignKey: 'productId' });


Stock.belongsTo(StockLocation, { foreignKey: 'locationId' });
StockLocation.hasMany(Stock, { foreignKey: 'locationId' });


module.exports = Stock;