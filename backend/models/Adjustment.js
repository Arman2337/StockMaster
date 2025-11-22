const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Adjustment = sequelize.define('Adjustment', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
reason: { type: DataTypes.STRING }
}, { tableName: 'adjustments' });


module.exports = Adjustment;