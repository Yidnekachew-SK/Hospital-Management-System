const db = require('../config/db');

// 1. Logic to save a new ward to the DB
exports.addWard = async (wardName, deptID, capacity) => {
    const sql = "INSERT INTO Wards (WardName, DeptID, Capacity) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [wardName, deptID, capacity]);
    return result.insertId;
};

// 2. Logic to get all wards
exports.getAllWards = async () => {
    const [rows] = await db.execute("SELECT * FROM Wards");
    return rows;
};

// 3. Logic to save a new room to the DB
exports.addRoom = async (wardID, roomNumber, roomType, maxCapacity) => {
    const sql = "INSERT INTO Rooms (WardID, RoomNumber, RoomType, MaxCapacity) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [wardID, roomNumber, roomType, maxCapacity]);
    return result.insertId;
};

// 4. Logic to get all rooms
exports.getAllRooms = async () => {
    const [rows] = await db.execute("SELECT * FROM Rooms");
    return rows;
};
