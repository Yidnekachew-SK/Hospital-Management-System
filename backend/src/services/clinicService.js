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
exports.addRoom = async (wardID, roomNumber, roomType, maxCapacity, currentOccupancy = 'AVAILABLE') => {
    const sql = "INSERT INTO Rooms (WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [wardID, roomNumber, roomType, maxCapacity, currentOccupancy]);
    return result.insertId;
};

// 4. Logic to get all rooms
exports.getAllRooms = async () => {
    const [rows] = await db.execute("SELECT * FROM Rooms");
    return rows;
};

// 5. Logic to count active occupants in a specific room
exports.getRoomOccupancyCount = async (roomID) => {
    const sql = "SELECT COUNT(*) as OccupancyCount FROM Admissions WHERE RoomID = ? AND DischargeDate IS NULL";
    const [rows] = await db.execute(sql, [roomID]);
    return rows[0].OccupancyCount;
};

// 6. Logic to update a ward
exports.updateWard = async (wardID, wardName, deptID, capacity) => {
    const sql = "UPDATE Wards SET WardName = ?, DeptID = ?, Capacity = ? WHERE WardID = ?";
    const [result] = await db.execute(sql, [wardName, deptID, capacity, wardID]);
    return result.affectedRows > 0;
};

// 7. Logic to update a room
exports.updateRoom = async (roomID, wardID, roomNumber, roomType, maxCapacity, currentOccupancy = 'AVAILABLE') => {
    const sql = "UPDATE Rooms SET WardID = ?, RoomNumber = ?, RoomType = ?, MaxCapacity = ?, CurrentOccupancy = ? WHERE RoomID = ?";
    const [result] = await db.execute(sql, [wardID, roomNumber, roomType, maxCapacity, currentOccupancy, roomID]);
    return result.affectedRows > 0;
};

// 8. Logic to count all wards globally and by department
exports.getWardCounts = async () => {
    const sql = `
        SELECT 
            COUNT(*) as TotalWards,
            SUM(CASE WHEN d.DeptID IS NOT NULL THEN 1 ELSE 0 END) as WardsWithDept
        FROM Wards w
        LEFT JOIN Departments d ON w.DeptID = d.DeptID
    `;
    const [rows] = await db.execute(sql);
    return rows[0];
};

// 9. Logic to get wards by department
exports.getWardsByDepartment = async (deptID) => {
    const sql = "SELECT * FROM Wards WHERE DeptID = ?";
    const [rows] = await db.execute(sql, [deptID]);
    return rows;
};

// 10. Logic to get room counts by ward
exports.getRoomCountByWard = async (wardID) => {
    const sql = "SELECT COUNT(*) as RoomCount FROM Rooms WHERE WardID = ?";
    const [rows] = await db.execute(sql, [wardID]);
    return rows[0].RoomCount;
};
