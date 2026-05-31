const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

console.log("Checking Clinic Controller Import:", clinicController);

router.post('/wards', clinicController.createWard);
router.get('/wards', clinicController.getWards);
router.put('/wards/:WardID', clinicController.updateWard);
router.get('/wards/department/:DeptID', clinicController.getWardsByDepartment);
router.get('/wards/counts', clinicController.getWardCounts);

router.post('/rooms', clinicController.createRoom);
router.get('/rooms', clinicController.getRooms);
router.put('/rooms/:RoomID', clinicController.updateRoom);
router.get('/rooms/:RoomID/occupancy', clinicController.getRoomOccupancyCount);
router.get('/rooms/ward/:WardID/count', clinicController.getRoomCountByWard);

module.exports = router;
