const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const sequelize = require('./config/db');


// import models so associations run
const User = require('./models/User');
const Warehouse = require('./models/Warehouse');
const StockLocation = require('./models/StockLocation');
const Product = require('./models/Product');
const Stock = require('./models/Stock');
const Receipt = require('./models/Receipt');
const ReceiptItem = require('./models/ReceiptItem');
const Delivery = require('./models/Delivery');
const DeliveryItem = require('./models/DeliveryItem');
const Transfer = require('./models/Transfer');
const TransferItem = require('./models/TransferItem');
const Adjustment = require('./models/Adjustment');
const Ledger = require('./models/Ledger');
const PasswordReset = require('./models/PasswordReset');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const operationsRoutes = require('./routes/operationsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ops', operationsRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => res.json({ ok: true, name: 'StockMaster API' }));


async function start() {
try {
await sequelize.authenticate();
console.log('DB connected');
await sequelize.sync({ alter: true });
console.log('DB synced');
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on', port));
} catch (err) {
console.error('Failed to start', err);
process.exit(1);
}
}


start();