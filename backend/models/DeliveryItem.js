const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Delivery = require('./Delivery');
const StockLocation = require('./StockLocation');


const DeliveryItem = sequelize.define('DeliveryItem', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
quantity: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'delivery_items' });


DeliveryItem.belongsTo(Delivery, { foreignKey: 'deliveryId' });
Delivery.hasMany(DeliveryItem, { foreignKey: 'deliveryId' });


DeliveryItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(DeliveryItem, { foreignKey: 'productId' });


DeliveryItem.belongsTo(StockLocation, { foreignKey: 'locationId' });
StockLocation.hasMany(DeliveryItem, { foreignKey: 'locationId' });


module.exports = DeliveryItem;