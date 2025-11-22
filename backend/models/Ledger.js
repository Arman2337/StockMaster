const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Ledger = sequelize.define('Ledger', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
type: { type: DataTypes.ENUM('receipt','delivery','transfer','adjustment'), allowNull: false },
refId: { type: DataTypes.INTEGER.UNSIGNED },
productId: { type: DataTypes.INTEGER.UNSIGNED },
fromLocationId: { type: DataTypes.INTEGER.UNSIGNED },
toLocationId: { type: DataTypes.INTEGER.UNSIGNED },
quantity: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'ledger' });


module.exports = Ledger;