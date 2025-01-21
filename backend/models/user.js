const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    userName: String,
    lastName: String,
    gender: String,
    pwd: String,
    contactDetails: {
        fullName:String,
        phone: String,
        email: String,
        address: String,
        country:String,
        city:String,
        state:String,
    },
    bankAccountInfo: {
        accountHolderName:String,
        accountNumber: String,
        bankName: String,
        branchName: String,
        swiftCode: String
    },
    role: { type: String, default: "Client" },
    avatar: { type: String, default: "http://localhost:3000/images/avatar.png" },
    authorizedSignatures: [
        {   
            role: { type: String, required: true, enum: ['Owner', 'HOD', 'Manager', 'Other'] }, // Role of the signer
            signaturePath: { type: String, required: true }, // Path to SVG file
            uploadedAt: { type: Date, default: Date.now }, // Timestamp for when the signature was uploaded
        },
    ],
    priceQuotationID:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PriceQuotation"
        }
    ],
    purchaseRequsitionsID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseRequisition"
        }
    ],
    purchaseOrdersID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseOrder",
        }
    ],
    invoicesID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice"
        }
    ],
    billsID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill"
        }
    ],
   
    entityID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entity"
    }],


},{ timestamps: true });
const user = mongoose.model("User", userSchema);
module.exports = user;