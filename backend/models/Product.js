const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Product = sequelize.define('Product', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
sku: { type: DataTypes.STRING, allowNull: false, unique: true },
category: { type: DataTypes.STRING },
uom: { type: DataTypes.STRING, defaultValue: 'pcs' },
reorder_level: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
}, { tableName: 'products' });


module.exports = Product;