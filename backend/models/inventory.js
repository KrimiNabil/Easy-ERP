const mongoose = require('mongoose');

// Schema for individual inventory items
const inventorySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productCode: {
        type: String,
        // unique: true,
        // required: true,
    },
    category: {
        type: String,
        // required: true,
    },
    desqription: {
        type: String,
    },
    units: {
        type: String,
        enum: ["Pieces", "Inches", "Kilograms", "Box"],
        default: "Pieces"
    },
    quantity: {
        type: Number,
        default: 0,
        // required: true,
    },
    restockThreshold: {
        type: Number,
        default: 10, // Low stock alert threshold
    },
    purchasePricePerUnit: {
        type: Number,
        // required: true,
    },
    sellsPricePerUnit: {
        type: Number,
        // required: true,
    },
    supplierDetails: {
        name: String,
        address: String,
        email: String,
        phone: String,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Schema for tracking inventory movements (useful for historical data and charts)
const inventoryMovementSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        ref: 'Inventory',
    },
    movementType: {
        type: String,
        enum: ['incoming', 'outgoing'],
        required: true,
    },
    units: {
        type: String,
        enum: ["Pieces", "Inches", "Kilograms", "Box"],
        default: "Pieces"
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        enum: ["Sell", "Purchase", "Transfer", "Damage"],
    },
},{ timestamps: true });

// Models
const Inventory = mongoose.model('Inventory', inventorySchema);
const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);

module.exports = { Inventory, InventoryMovement };
