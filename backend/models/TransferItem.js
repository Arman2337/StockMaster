const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Transfer = require('./Transfer');
const StockLocation = require('./StockLocation');


const TransferItem = sequelize.define('TransferItem', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
quantity: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'transfer_items' });


TransferItem.belongsTo(Transfer, { foreignKey: 'transferId' });
Transfer.hasMany(TransferItem, { foreignKey: 'transferId' });


TransferItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(TransferItem, { foreignKey: 'productId' });


TransferItem.belongsTo(StockLocation, { as: 'fromLocation', foreignKey: 'fromLocationId' });
TransferItem.belongsTo(StockLocation, { as: 'toLocation', foreignKey: 'toLocationId' });


module.exports = TransferItem;