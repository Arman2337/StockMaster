const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Receipt = require('./Receipt');
const StockLocation = require('./StockLocation');


const ReceiptItem = sequelize.define('ReceiptItem', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
quantity: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'receipt_items' });


ReceiptItem.belongsTo(Receipt, { foreignKey: 'receiptId' });
Receipt.hasMany(ReceiptItem, { foreignKey: 'receiptId' });


ReceiptItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ReceiptItem, { foreignKey: 'productId' });


ReceiptItem.belongsTo(StockLocation, { foreignKey: 'locationId' });
StockLocation.hasMany(ReceiptItem, { foreignKey: 'locationId' });


module.exports = ReceiptItem;