const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const PurchaseOrder = require('../models/purchaseOrder')
const generatePDF = require('../payablePDFs/invoicePDF/invoicePDFGenerat');
const path = require('path');


// Add Invoice
router.post("/", (req, res) => {
    console.log(req.body);
    let id = "invoice-" + req.body.invoiceID;
    console.log(id);
    PurchaseOrder.findById(req.body.referencePO).then(
        (foundedPO) => {
            if (!foundedPO) {
                res.json({ msg: "Purchase Order Does not exist" })
            } else {
                Invoice.findOne({ invoiceID: id }).then(
                    (doc) => {
                        console.log(doc);
                        if (doc) {
                            res.json({ msg: "Player alredy exist " });
                        } else {
                            let invoice = new Invoice({
                                invoiceID: id,
                                date: req.body.date,
                                dueDate: req.body.dueDate,
                                amount: req.body.amount,
                                currency: req.body.currency,
                                subtotal: req.body.subtotal,
                                products: req.body.products,
                                bankAccountInfo: {
                                    accountHolderName: req.body.holderNamer,
                                    accountNumber: req.body.accountNumber,
                                    bankName: req.body.bankName,
                                    branchName: req.body.bankBranch,
                                    email: req.body.email
                                },
                                discountsAndAdjustments: {
                                    discount: req.body.discount,
                                    discountTerms: req.body.discountTerms,
                                    adjustments: req.body.adjustments,
                                },
                                approval: {
                                    approvedBy: req.body.approvedBy,
                                    date: req.body.approvalDate,
                                },
                                createdBy: req.body.createdBy,
                                purchaseOrderID: foundedPO._id,
                                userID: req.body.userID,
                            });
                            invoice.save(async (err, doc) => {
                                if (err) {
                                    console.error("Error saving invoice:", err);
                                    return res.status(500).json({ msg: "Error saving invoice", error: err.message });
                                }
                                if (!doc) {
                                    return res.status(400).json({ msg: "Failed to save invoice" });
                                }

                                try {
                                    // Generate the PDF and get the path
                                    const pdfPath = await generatePDF(JSON.stringify(doc));
                                    console.log(`PDF saved at: ${pdfPath}`);
                                    // Save the PDF path in the invoice document
                                    doc.pdf = `http://localhost:3000/invoice/pdf/${path.basename(pdfPath)}`;
                                    await doc.save();
                                    // Update the Purchase Order with the invoice ID
                                    foundedPO.invoices.push(doc._id);
                                    await foundedPO.save();
                                    // Respond with success and the PDF path
                                    return res.json({ msg: "Invoice added successfully", path: doc.path });
                                } catch (error) {
                                    console.error("Error generating PDF:", error);
                                    return res.status(500).json({ msg: "Error generating PDF", error: error.message });
                                }
                            });

                            //   invoice.save(async (err, doc) => {
                            //     console.log("here doc",doc);

                            //         if (doc) {
                            //             let pdfPath;
                            //                 try {
                            //                     const pdfPath = await generatePDF(JSON.stringify(doc));
                            //                     console.log(`PDF saved at: ${pdfPath}`);
                            //                     res.json({ msg: "added with success",path:pdfPath })

                            //                     doc.pdf.push(pdfPath);
                            //                     doc.save()
                            //                 } catch (error) {
                            //                     console.log();
                            //                     (`Error: ${error.message}`);
                            //                 }

                            //             foundedPO.invoices.push(doc._id);
                            //             foundedPO.save();
                            //             res.json({ msg: "added with success",path:pdfPath })
                            //             // save the id of the new added invoice tothe  PO
                            //             foundedPO.invoices.push(doc._id)
                            //         }

                            //     });

                        }
                    }
                )
            }
        }
    )


});
// Get Invoice By ID
router.get("/:id", (req, res) => {
    console.log(req.params.id);
    Invoice.findOne({ _id: req.params.id }).populate("purchaseOrderID").then(
        (doc) => {
            console.log(doc);
            if (doc) {
                res.json({ msg: "here invoce", invoice: doc })
            } else {
                res.json({ msg: "invoce not found" })
            }
        }
    )
});
// Get All Invoice
router.get("/", (req, res) => {
    Invoice.find().populate("purchaseOrderID").then(
        (docs) => {
            if (docs) {
                res.json({ msg: "here invoces", invoices: docs })
            } else {
                res.json({ msg: "invoces not found" })
            }
        }
    )
});
// Get Invoice by invoiceID
router.get("/number/:invoiceID", (req, res) => {
    console.log(req.params.invoiceID);
    let currentYear = new Date().getFullYear();
    let x = currentYear + "/" + req.params.invoiceID;
    console.log(x);
    Invoice.findOne({ invoiceID: x }).populate('products').then(
        (doc) => {
            console.log(doc);

            if (doc) {
                res.json({ msg: "here invoces", inoice: doc });
            } else {
                res.json({ msg: "invoces not found" });
            }
        }
    )
});
// Update Invoice 

router.put("/", async (req, res) => {
    try {
        // Update the invoice with new data
        const updateResult = await Invoice.findByIdAndUpdate({ _id: req.body._id }, req.body);

        if (updateResult.nModified === 1) {
            // Generate the PDF and get its path
            const pdfPath = await generatePDF(JSON.stringify(req.body));

            console.log(`PDF saved at: ${pdfPath}`);
            req.body.pdf = `http://localhost:3000/invoice/pdf/${path.basename(pdfPath)}`;
            await req.body.save();
            // // Update the document with the PDF path
            // const updatedInvoice = await Invoice.findByIdAndUpdate(
            //     req.body._id,
            //     { pdf: `http://localhost:3000/invoice/pdf/${path.basename(pdfPath)}` },
            //     { new: true }
            // );
            res.status(200).json({ msg: "Invoice updated successfully", pdf: updatedInvoice.pdf });


            // if (updatedInvoice) {
            //     res.status(200).json({ msg: "Invoice updated successfully", pdf: updatedInvoice.pdf });
            // } else {
            //     res.status(500).json({ msg: "Failed to update PDF path" });
            // }
        } else {
            res.status(400).json({ msg: "No changes made to the invoice" });
        }
    } catch (error) {
        console.error("Error in update endpoint:", error.message);
        res.status(500).json({ msg: "Failed to update invoice", error: error.message });
    }
});

// Delete Invoice By ID
router.delete("/:id", (req, res) => {
    Invoice.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) {
                res.json({ msg: "deleted" })
            } else {
                res.json({ msg: "delete error" })
            }
        }
    )

});

// update status

router.put("/updateStatuse/:id", async (req, res) => {
    try {
        let newStatuse = req.body.status
        console.log(newStatuse);

        const invoice = await Invoice.findById(req.params.id);
        console.log(invoice);

        if (!invoice) {
            return res.status(404).json({ msg: "invoice not found" });
        }

        invoice.status = newStatuse;


        await invoice.save();

        res.json({ msg: "invoice successfully updated", update: invoice.status });
    } catch (err) {
        console.error("Error canceling invoice:", err);
        res.status(500).json({ msg: "Error updting invoice statuse", error: err.message });
    }
});

// Route to cancel an invoice
router.put("/invoice/:id/cancel", async (req, res) => {
    try {
        // Find the invoice by ID
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ msg: "Invoice not found" });
        }

        // Check if the invoice is eligible for cancellation
        if (invoice.status !== "Pending" && invoice.status !== "Draft") {
            return res.status(400).json({ msg: "Cannot cancel this invoice" });
        }

        // Update the status to "Canceled"
        invoice.status = "Canceled";
        await invoice.save();

        res.json({ msg: "Invoice successfully canceled", invoice });
    } catch (err) {
        res.status(500).json({ msg: "Error canceling the invoice", error: err.message });
    }
});

// Endpoint to get the last 6 invoices
router.get('/recent/invoice/total', async (req, res) => {
    try {
        const recentInvoices = await Invoice.find({})
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(6); // Limit to 6 invoices
        

        res.status(200).json({invoices:recentInvoices});
    } catch (error) {
        console.error('Error fetching recent invoices:', error);
        res.status(500).json({ message: 'Error fetching recent invoices' });
    }
});
// charts visualization
router.get("/totals/invoices", async (req, res) => {
    try {
        const totalInvoices = await Invoice.aggregate([
            {
                $match: {
                    status: "Completed",
                    // pqID: { $exists: true, $ne: null } // Only invoices with related PQ IDs
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } } // Calculate total
        ]);
        console.log(totalInvoices);
        
        res.json({ totalInvoices: totalInvoices[0]?.total || 0 });
    } catch (err) {
        res.status(500).json({ msg: "Error calculating invoice total", error: err.message });
    }
});

// Endpoint to calculate invoice amounts by status
router.get('/amount/status', async (req, res) => {
    try {
        const statusAmounts = await Invoice.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            statusAmounts,
        });
    } catch (error) {
        console.error('Error calculating invoice amounts by status:', error);
        res.status(500).json({ message: 'Error calculating invoice amounts by status' });
    }
});


module.exports = router;