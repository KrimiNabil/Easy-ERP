const mongoose = require('mongoose');

const entitySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Company name
    logo: { type: String, required: true }, // Company logo
    registrationNumber: { type: String, required: true, unique: true }, // Legal registration number
    industry: { type: String, required: true, enum: ['Tech', 'Healthcare', 'Finance', 'Retail', 'Education', 'Other'] }, // Restricted to predefined industries
    website: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email format validation
    phone: { type: String, required: true }, // Contact phone number
    
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to Employee model
        },
    ],
    departments: [
        {
            name: { type: String, required: true }, // Department name
            head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Head of the department
            employees: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Employees in the department
                },
            ],
        },
    ],
    bankDetails: {
        accountHolderName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        branchName: { type: String },
        swiftCode: { type: String },
    },
   
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    invoicesID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
        },
    ],
    billsID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill",
        },
    ],
    purchaseOrdersID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseOrder",
        },
    ],
    purchaseRequisitionsID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseRequisition",
        },
    ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const entity = mongoose.model("Entity", entitySchema);
module.exports = entity;
