const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

console.log("Checking Clinic Controller Import:", clinicController);

router.post('/wards', clinicController.createWard);
router.get('/wards', clinicController.getWards);

router.post('/rooms', clinicController.createRoom);
router.get('/rooms', clinicController.getRooms);

module.exports = router;
