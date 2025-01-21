/*
         Express application imports
*/
// Import express module
const express = require('express');
// creat express application
const app = express()
// import body parser
const bodyParser=require("body-parser");
// import user.js that has all user BL
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/easyERP', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Security configuration
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader(

        "Access-Control-Allow-Headers",

        "Origin, Accept, Content-Type, X-Requested-with, Authorization"

    );

    res.setHeader(

        "Access-Control-Allow-Methods",

        "GET, POST, DELETE, OPTIONS, PATCH, PUT"

    );

    next();

});
// BL routing
const userRout=require("./routes/user");
const entityRout=require("./routes/entity");
const invoiceRout=require("./routes/invoice");
const billRout=require("./routes/bill");
const purchaseRout=require("./routes/purchasOrder");
const requisitionRout=require("./routes/requisition");
const inventoryRout=require("./routes/inventory");
const priceRout=require("./routes/priceQoutatin");

// import express-sission
const session=require('express-session');

/*
         Express application config 
*/
// session Config
const key="Pscho101";
app.use(session({
    secret:key,
    resave: false, // Do not resave session if not modified
    saveUninitialized: false, // Do not save uninitialized session
    cookie: { secure: false } // Set secure: true if using HTTPS
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// use user.js to hanbel any BL that starts with /userc

const path=require('path')
// image will replace the path backend/uploads 
app.use('/requisitions', express.static(path.join('backend/payablePDFs/requisitionPDF/PDFs')))
// image will replace the path backend/uploads 
app.use('/bill/pdf', express.static(path.join( 'backend/payablePDFs/billPDF/PDFs')))
// image will replace the path backend/uploads 
app.use('/invoice/pdf', express.static(path.join( 'backend/payablePDFs/invoicePDF/PDFs')))
// image will replace the path backend/uploads 
app.use('/puchaseOrder/pdf', express.static(path.join( 'backend/payablePDFs/purchasePDF/PDFs')))
// image will replace the path backend/uploads 
app.use('/pq/pdf', express.static(path.join( 'backend/payablePDFs/quotationPDF/PDFs')))
// image will replace the path backend/uploads 
app.use('/images', express.static(path.join('backend/uploads')))

app.use("/user",userRout);
app.use("/entity",entityRout);
app.use("/invoice",invoiceRout);
app.use("/bill",billRout);
app.use("/purchaseOrder",purchaseRout);
app.use("/requisition",requisitionRout);
app.use("/api/inventory",inventoryRout);
app.use("/price/quotation",priceRout);






//export express application
module.exports = app;