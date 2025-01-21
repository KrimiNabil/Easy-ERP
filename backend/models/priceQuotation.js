const mongoose = require("mongoose");

const PriceQuotationSchema = new mongoose.Schema({
    quotationNumber: {
        type: String,
        // required: true,
        // unique: true,
        // trim: true,
        // index: true
    },
    pdf:{ type: String},
    supplier: {
        email:String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Supplier", // Reference to Supplier model
        // // required: true
    },
    items: [
        {
            itemID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory", // Reference to Item model
                required: true
            },
            productName: {
                type: String,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            priceHT: {
                type: Number,
                required: true,
                min: 0
            },
            priceTTC: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    subtotal: {
        type: Number,
        // required: true,
        // min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        // required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    approvalHistory: [
        {
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User" // Reference to User model
            },
            approvedAt: {
                type: Date
            },
            status: {
                type: String,
                enum: ["Pending", "Approved", "Declined"],
                // required: true
            },
            remarks: {
                type: String,
                trim: true
            }
        }
    ],
    validityPeriod: {
        startDate: {
            type: Date,
            // required: true
        },
        endDate: {
            type: Date,
            // required: true
        }
    },
    notes: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference to User model
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    updatedAt: {
        type: Date
    }
},{ timestamps: true });

module.exports = mongoose.model("PriceQuotation", PriceQuotationSchema);
