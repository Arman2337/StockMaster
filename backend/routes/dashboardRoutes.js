const express = require('express');
const router = express.Router();
const dash = require('../controllers/dashboardController');
const auth = require('../middleware/auth');


router.get('/kpis', auth, dash.getKPIs);


module.exports = router;