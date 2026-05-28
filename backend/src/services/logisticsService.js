const db = require('../config/db');

// 1. Logic to save a new supplier
exports.addSupplier = async (supplierName, contactPerson, phone, address) => {
    const sql = "INSERT INTO Suppliers (SupplierName, ContactPerson, Phone, Address) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [supplierName, contactPerson, phone, address]);
    return result.insertId;
};

// 2. Logic to get all suppliers
exports.getAllSuppliers = async () => {
    const [rows] = await db.execute("SELECT * FROM Suppliers");
    return rows;
};

// 3. Logic to save an inventory item
exports.addInventoryItem = async (itemName, category, quantity, reorderLevel, supplierID) => {
    const sql = "INSERT INTO Inventory (ItemName, Category, Quantity, ReorderLevel, SupplierID) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [itemName, category, quantity, reorderLevel, supplierID]);
    return result.insertId;
};

// 4. Logic to get all inventory items
exports.getAllInventory = async () => {
    const [rows] = await db.execute("SELECT * FROM Inventory");
    return rows;
};
