const express = require('express');
const router = express.Router();
// const puppeteer=require('puppeteer');
// const generatPDF = require('../payablePDFs/billPDF/billPDFGenerat');
const Bill = require('../models/bill');
const Invoice = require('../models/invoice');
const User = require('../models/user');
const path = require('path');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');




const compile = async function (fileName, data) {
    try {
        const filePath = path.join(process.cwd(), 'backend/payablePDFs/billPDF/', `${fileName}.hbs`);
        console.log(filePath);

        const html = await fs.readFile(filePath, 'utf8');
        // Compile template with data
        return hbs.compile(html)(data);
    } catch (error) {
        console.error(`Error compiling template: ${error.message}`);
        throw new Error(`Template file ${fileName}.hbs could not be found or read.`);
    }
};

async function generatePDF(doc) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();


        const plainDoc = JSON.parse(doc);
        console.log("Data passed to template:", plainDoc); // Verify doc data here

        const content = await compile("index", plainDoc);
        console.log(plainDoc.paymentID);

        await page.setContent(content);
        // Change the directory path here to save PDFs to the new location
        const pdfDirectory = 'backend/payablePDFs/billPDF/PDFs/';
        const pdfPath = path.join(process.cwd(), pdfDirectory, `${plainDoc.paymentID}.pdf`);
        // Ensure that the directory exists
        console.log(pdfPath);

        await fs.ensureDir(path.dirname(pdfPath));
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        console.log(`PDF generated successfully: ${plainDoc.paymentID}.pdf`);

        // Return the public URL of the generated PDF
        const publicUrl = `http://localhost:3000/bill/pdf/${plainDoc.paymentID}.pdf`;
        return publicUrl;
        // Ensure consistent forward slashes for URLs

    } catch (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw new Error('PDF generation failed.');

    }

}
// Add Bill
router.post("/",  (req, res) => {
    console.log("object recived from FE", req.body);
    let billID = `Bill-${req.body.paymentID}`
    Invoice.findById(req.body.reference).then(
        (foundedInvoice) => {
            if (!foundedInvoice) {
                res.json({ msg: "invoice does not exist" })
            } else {
                User.findById({_id:req.body.userID}).then(
                    (foundedUser) => {
                        if (!foundedUser) {
                            res.json({ msg: "Please connect again" });
                        } else {
                            Bill.findOne({ paymentID: billID }).then(
                                (doc) => {
                                    console.log(doc);
                                    if (doc) {
                                        res.json({ msg: "bill exist" })
                                    } else {
                                        let bill = new Bill({
                                            documentName: "Bill",
                                            status: "Pending",
                                            paymentID: billID,
                                            date: req.body.date,
                                            paymentSum: req.body.products,
                                            receiver: {
                                                accountHolderName: req.body.accountHolderName,
                                                accountNumber: req.body.accountNumber,
                                                bankName: req.body.bankName,
                                                branchName: req.body.branchName,
                                                swiftCode: req.body.swiftCode
                                            },
                                            amount: req.body.amount,
                                            method: req.body.method,
                                            account: req.body.amount,
                                            userID: foundedUser._id,
                                            invoiceID: foundedInvoice._id
                                        })
                                        bill.save(async (err, doc) => {
                                            if (err) {
                                                console.error("Error saving bill:", err);
                                                return res.status(500).json({ msg: "Error saving bill", error: err.message });
                                            }
                                            if (!doc) {
                                                return res.status(400).json({ msg: "Failed to save bill" });
                                            }
                                            try {
                                                // Generate the PDF and get the path
                                                const pdfPath = await generatePDF(JSON.stringify(doc));
                                                console.log(`PDF generated at: ${pdfPath}`);


                                                // Save the PDF path in the bill document
                                                doc.pdf = `http://localhost:3000/bill/pdf/${path.basename(pdfPath)}`;
                                                console.log(doc.pdf);

                                                await doc.save();

                                                // Update related Invoice and User records
                                                foundedInvoice.billsID.push(doc._id);
                                                await foundedInvoice.save();

                                                foundedUser.billsID.push(doc._id);
                                                await foundedUser.save();

                                                // Respond with success and the PDF path
                                                return res.json({ msg: "Bill saved successfully", path: pdfPath });
                                            } catch (error) {
                                                console.error("Error generating PDF or updating related records:", error);
                                                return res.status(500).json({ msg: "Error during bill processing", error: error.message });
                                            }
                                        });
                                    }
                                }
                            )
                        }
                    }
                )

            }
        }
    )

});



// get all bills
router.get("/", (req, res) => {
    Bill.find().populate("invoiceID").then(
        (docs) => {
            if (docs) { res.json({ msg: "here bills", bills: docs }) } else { res.json({ msg: "no bills" }) }
        }
    )
});
// get bill by id
router.get("/:id", (req, res) => {
    Bill.findById({ _id: req.params.id }).populate("invoiceID").then(
        (doc) => {
            if (doc) { res.json({ msg: "here bill", bill: doc }) } else { res.json({ msg: "no bill" }) }
        }
    )
})
// delete bill by id
router.delete("/:id", (req, res) => {
    console.log(req.params.id);

    Bill.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) { res.json({ msg: true }) } else { res.json({ msg: false }) }
        }
    )
})
// update bill
router.put("/", (req, res) => {
    Bill.updateOne({ _id: req.body._id }, req.body).then(
        (doc) => {
            if (doc.nModified) { res.json({ msg: "updated" }) } else { res.json({ msg: "update error" }) }
        }
    )
})


module.exports = router;