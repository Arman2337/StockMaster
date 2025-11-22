const Product = require('../models/Product');
const Stock = require('../models/Stock');
const StockLocation = require('../models/StockLocation');


async function createProduct(req, res) {
const { name, sku, category, uom, initialStock, locationId, reorder_level } = req.body;
if (!name || !sku) return res.status(400).json({ error: 'Missing name or sku' });
const p = await Product.create({ name, sku, category, uom, reorder_level });
if (initialStock && locationId) {
await Stock.create({ productId: p.id, locationId, quantity: parseFloat(initialStock) });
}
res.json(p);
}


async function updateProduct(req, res) {
const { id } = req.params;
const p = await Product.findByPk(id);
if (!p) return res.status(404).json({ error: 'Not found' });
await p.update(req.body);
res.json(p);
}


async function getProducts(req, res) {
const products = await Product.findAll();
res.json(products);
}


async function getProductStock(req, res) {
const { productId } = req.params;
const stocks = await Stock.findAll({ where: { productId }, include: [StockLocation] });
res.json(stocks);
}


module.exports = { createProduct, updateProduct, getProducts, getProductStock };