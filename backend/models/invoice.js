const mongoose = require('mongoose');
const { timeStamp } = require('node:console');


const invoiceSchema = mongoose.Schema({
    documentName: { type: String, default: "Invoice" },
    invoiceID: String,
    date: String,
    dueDate: String,
    amount: Number,
    subtotal: Number,
    currency: String,
    pdf: String,
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    products: [
        {
            productName: String,
            quantity: Number,
            priceHT: Number,
            priceTVA: Number,
            priceTTC: Number,
        }
    ],
    bankAccountInfo: {
        accountHolderName: String,
        accountNumber: String,
        bankName: String,
        branchName: String,
        email: String
    },
    discountsAndAdjustments: {
        discount: Number,
        discountTerms: String,
        adjustments: String,
    },
    approval: {
        status: String,
        date: String,
        approvedBy: String
    },
    // to keep track of modification
    auditTrail: {
        createdBy: String,
        modifiedBy: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: Date
    },
    purchaseOrderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchaseOrder",
    },
    billsID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill"
        }
    ],
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    pqID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PriceQuotation"
    }
},{ timestamps: true }
)
const invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = invoice;

