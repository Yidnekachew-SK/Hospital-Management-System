const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');

console.log("Checking Logistics Controller Import:", logisticsController);

router.post('/suppliers', logisticsController.createSupplier);
router.get('/suppliers', logisticsController.getSuppliers);

router.post('/inventory', logisticsController.addInventory);
router.get('/inventory', logisticsController.getInventory);

module.exports = router;
