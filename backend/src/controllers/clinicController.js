const clinicService = require('../services/clinicService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createWard = async (req, res, next) => {
    try {
        const { WardName, DeptID, Capacity } = req.body;

        if (!WardName || !DeptID || !Capacity) {
            return sendError(res, 'WardName, DeptID, and Capacity are required', 400);
        }

        const wardId = await clinicService.addWard(WardName, DeptID, Capacity);
        sendSuccess(res, 'Ward created successfully', { WardID: wardId, WardName, DeptID, Capacity }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getWards = async (req, res, next) => {
    try {
        const wards = await clinicService.getAllWards();
        sendSuccess(res, 'Wards retrieved successfully', { count: wards.length, wards }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createRoom = async (req, res, next) => {
    try {
        const { WardID, RoomNumber, RoomType, MaxCapacity } = req.body;

        if (!WardID || !RoomNumber || !RoomType || !MaxCapacity) {
            return sendError(res, 'WardID, RoomNumber, RoomType, and MaxCapacity are required', 400);
        }

        const roomId = await clinicService.addRoom(WardID, RoomNumber, RoomType, MaxCapacity);
        sendSuccess(res, 'Room created successfully', { RoomID: roomId, WardID, RoomNumber, RoomType, MaxCapacity }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await clinicService.getAllRooms();
        sendSuccess(res, 'Rooms retrieved successfully', { count: rooms.length, rooms }, 200);
    } catch (error) {
        next(error);
    }
};
