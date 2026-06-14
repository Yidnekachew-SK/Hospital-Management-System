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
        const { WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy } = req.body;

        if (!WardID || !RoomNumber || !RoomType || !MaxCapacity) {
            return sendError(res, 'WardID, RoomNumber, RoomType, and MaxCapacity are required', 400);
        }

        const roomId = await clinicService.addRoom(WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy || 'AVAILABLE');
        sendSuccess(res, 'Room created successfully', { RoomID: roomId, WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy: CurrentOccupancy || 'AVAILABLE' }, 201);
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

exports.getRoomOccupancyCount = async (req, res, next) => {
    try {
        const { RoomID } = req.params;

        if (!RoomID) {
            return sendError(res, 'RoomID is required', 400);
        }

        const occupancyCount = await clinicService.getRoomOccupancyCount(RoomID);
        sendSuccess(res, 'Room occupancy retrieved successfully', { RoomID, OccupancyCount: occupancyCount }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateWard = async (req, res, next) => {
    try {
        const { WardID } = req.params;
        const { WardName, DeptID, Capacity } = req.body;

        if (!WardID || !WardName || !DeptID || !Capacity) {
            return sendError(res, 'WardID, WardName, DeptID, and Capacity are required', 400);
        }

        const updated = await clinicService.updateWard(WardID, WardName, DeptID, Capacity);
        if (!updated) {
            return sendError(res, 'Ward not found or update failed', 404);
        }

        sendSuccess(res, 'Ward updated successfully', { WardID, WardName, DeptID, Capacity }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateRoom = async (req, res, next) => {
    try {
        const { RoomID } = req.params;
        const { WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy } = req.body;

        if (!RoomID || !WardID || !RoomNumber || !RoomType || !MaxCapacity) {
            return sendError(res, 'RoomID, WardID, RoomNumber, RoomType, and MaxCapacity are required', 400);
        }

        const updated = await clinicService.updateRoom(RoomID, WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy || 'AVAILABLE');
        if (!updated) {
            return sendError(res, 'Room not found or update failed', 404);
        }

        sendSuccess(res, 'Room updated successfully', { RoomID, WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy: CurrentOccupancy || 'AVAILABLE' }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getWardCounts = async (req, res, next) => {
    try {
        const counts = await clinicService.getWardCounts();
        sendSuccess(res, 'Ward counts retrieved successfully', counts, 200);
    } catch (error) {
        next(error);
    }
};

exports.getWardsByDepartment = async (req, res, next) => {
    try {
        const { DeptID } = req.params;

        if (!DeptID) {
            return sendError(res, 'DeptID is required', 400);
        }

        const wards = await clinicService.getWardsByDepartment(DeptID);
        sendSuccess(res, 'Wards retrieved successfully', { count: wards.length, wards }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getRoomCountByWard = async (req, res, next) => {
    try {
        const { WardID } = req.params;

        if (!WardID) {
            return sendError(res, 'WardID is required', 400);
        }

        const roomCount = await clinicService.getRoomCountByWard(WardID);
        sendSuccess(res, 'Room count retrieved successfully', { WardID, RoomCount: roomCount }, 200);
    } catch (error) {
        next(error);
    }
};
