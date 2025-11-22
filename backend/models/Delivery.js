const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');


const Delivery = sequelize.define('Delivery', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
customer: { type: DataTypes.STRING },
status: { type: DataTypes.ENUM('draft','waiting','ready','done','canceled'), defaultValue: 'draft' }
}, { tableName: 'deliveries' });


Delivery.belongsTo(User, { foreignKey: 'createdBy' });


module.exports = Delivery;