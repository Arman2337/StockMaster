const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const auth = require('../middleware/auth');


router.post('/', auth, productCtrl.createProduct);
router.put('/:id', auth, productCtrl.updateProduct);
router.get('/', auth, productCtrl.getProducts);
router.get('/:productId/stock', auth, productCtrl.getProductStock);


module.exports = router;