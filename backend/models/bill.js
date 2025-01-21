const mongoose = require('mongoose');


const billSchema = mongoose.Schema({
    documentName: { type: String, default: "Bill" },
    paymentID: String,
    paymentSum: {
        productName:String,
        description:String,
        quantity:String,
        priceHT: Number,
        priceTVA: Number,
        priceTTC: Number,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    date: String,
    dueDate: String,
    discount:Number,
    amount: Number,
    method: String,
    pdf:String,
    receiver: {
        accountHolderName:String,
        accountNumber: String,
        bankName: String,
        branchName: String,
        swiftCode: String
    },
    //istablishing of relation between bill and invoice
    invoiceID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Invoice" //Model Name
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
   
},{ timestamps: true });
const bill = mongoose.model("Bill", billSchema);

module.exports = bill;