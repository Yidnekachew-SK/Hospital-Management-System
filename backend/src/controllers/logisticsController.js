const logisticsService = require('../services/logisticsService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createSupplier = async (req, res, next) => {
    try {
        const { SupplierName, ContactPerson, Phone, Address } = req.body;

        if (!SupplierName) {
            return sendError(res, 'SupplierName is required', 400);
        }

        const supplierId = await logisticsService.addSupplier(SupplierName, ContactPerson, Phone, Address);
        sendSuccess(res, 'Supplier created successfully', { SupplierID: supplierId, SupplierName, ContactPerson, Phone, Address }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await logisticsService.getAllSuppliers();
        sendSuccess(res, 'Suppliers retrieved successfully', { count: suppliers.length, suppliers }, 200);
    } catch (error) {
        next(error);
    }
};

exports.addInventory = async (req, res, next) => {
    try {
        const { ItemName, Category, Quantity, ReorderLevel, SupplierID } = req.body;

        if (!ItemName || !Category || Quantity === undefined || ReorderLevel === undefined || !SupplierID) {
            return sendError(res, 'ItemName, Category, Quantity, ReorderLevel, and SupplierID are required', 400);
        }

        const itemId = await logisticsService.addInventoryItem(ItemName, Category, Quantity, ReorderLevel, SupplierID);
        sendSuccess(res, 'Inventory item added successfully', { ItemID: itemId, ItemName, Category, Quantity, ReorderLevel, SupplierID }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getInventory = async (req, res, next) => {
    try {
        const inventory = await logisticsService.getAllInventory();
        sendSuccess(res, 'Inventory retrieved successfully', { count: inventory.length, inventory }, 200);
    } catch (error) {
        next(error);
    }
};
