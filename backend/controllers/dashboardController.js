const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');


async function getKPIs(req, res) {
const totalProducts = await Product.count();
const totalStock = await Stock.sum('quantity') || 0;
const lowStockProducts = await Product.findAll({ where: { }, limit: 50 }); // compute low stocks below reorder in code
const pendingReceipts = await Receipt.count({ where: { status: 'waiting' } });
const pendingDeliveries = await Delivery.count({ where: { status: 'waiting' } });
res.json({ totalProducts, totalStock, pendingReceipts, pendingDeliveries, lowStockProducts });
}


module.exports = { getKPIs };