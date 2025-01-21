const mongoose = require('mongoose');

const purchaseOrderSchema = mongoose.Schema({
    documentName: { type: String, default: "Purchase Order" },
    purchaseOrder: String,
    date: String,
    poDate: String,
    amount: Number,
    pdf:String,
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    products: [{
        itemName: String,
        quentity: Number,
        priceHT: Number,
        priceTVA: Number,
        priceTTC: Number,
        description: String
    }], // List of items or services ordered

    discountsAndAdjustments: {
        discountTerms: String,
        discount: Number,
        adjustments: String
    },
    approval: {
        status: String,
        date: Date,
        approvedBy: String
    },
    // to keep track of modification
    auditTrail: {
        createdBy: String,
        modifiedBy: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: Date
    },
    createdby:String,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    entityID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entity"
    },
    invoices:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
    }],
    purchaseRequsitionsID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchaseRequisition",
    },

},{ timestamps: true });
const purchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
module.exports = purchaseOrder;