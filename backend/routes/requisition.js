const express = require("express");
const router = express.Router()

const generatePDF = require('../payablePDFs/requisitionPDF/requisitionPDFGenereat'); // Adjust the path as needed
const Requisition = require('../models/purchaseRequisition');
const User = require('../models/user')
const path = require('path');



router.post("/", (req, res) => {
    console.log(req.body);
    let requisitionId = `Requisition-${req.body.requisitionID}`;
    User.findById(req.body.userID).then(
        (foundedUser) => {
            if (!foundedUser) {
                res.json({ msg: "Log in again" })
            } else {
                Requisition.findOne({ requisitionID: requisitionId }).then(
                    (doc) => {
                        if (doc) {
                            res.json({ msg: "error" })
                        } else {
                            let requisition = new Requisition({
                                documentName: "Requisition",
                                requisitionID: requisitionId,

                                requestDate: req.body.requestDate,
                                dueDate: req.body.dueDate,
                                requester: {
                                    name: req.body.requesterName,
                                    // department: req.body.dueDate,
                                    // email: req.body.dueDate,
                                    // phone: req.body.dueDate,
                                },
                                products: req.body.products,
                                justification: req.body.justification,
                                approval: {
                                    approvers: [
                                        {
                                            name: req.body.approvedBy,
                                        }
                                    ],
                                },
                                auditTrail: {
                                    createdBy: foundedUser.userName,
                                },
                                userId: foundedUser._id,
                            })
                            requisition.save(async (err, doc) => {
                                if (err) {
                                    console.error("Error saving requisition:", err);
                                    return res.status(500).json({ msg: "Error saving requisition", error: err.message });
                                }
                                if (!doc) {
                                    return res.status(400).json({ msg: "Failed to save requisition" });
                                }
                                try {
                                    // Generate the PDF and get the file path
                                    const pdfPath = await generatePDF(JSON.stringify(doc));
                                    console.log(`PDF saved at: ${pdfPath}`);

                                    // Save the PDF path in the requisition document
                                    doc.pdf=`http://localhost:3000/requisitions/${path.basename(pdfPath)}`;
                                console.log(doc)
                                    await doc.save();
                                    // Save the requisition ID in the user's collection
                                   
                                    foundedUser.purchaseRequsitionsID.push(doc._id);
                                    await foundedUser.save();

                                    // Respond with success and the PDF path
                                    return res.json({ msg: "Requisition saved successfully", path: doc.pdf });
                                } catch (error) {
                                    console.error("Error generating PDF:", error);
                                    return res.status(500).json({ msg: "Error generating PDF", error: error.message });
                                }
                            });

                            // requisition.save((err,doc)=>{
                            //     if (doc) {
                            //         // save the PR id in user collection
                            //         foundedUser.purchaseRequsitionsID.push(doc._id);
                            //         foundedUser.save()
                            //     }
                            // })
                        }
                    }
                )
            }
        }
    )



});
router.get("/", (req, res) => {
    Requisition.find().then(
        (docs) => {
            if (docs) {
                res.json({ requisitions: docs })
            } else {
                res.json({ msg: "no data" })
            }
        }

    )
})
router.get("/:id", (req, res) => {
    Requisition.findOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc) {
                res.json({ msg: "here invoce", requisition: doc })
            } else {
                res.json({ msg: "invoce not found" })

            }
        }
    )

});
// delete bill by id
router.delete("/:id", (req, res) => {
    console.log(req.params.id);
    Requisition.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) { res.json({ msg: true }) } else { res.json({ msg: false }) }
        }
    )
})
router.put("/", (req, res) => {
    console.log(req.body);

    Requisition.updateOne({ _id: req.body._id }, req.body).then(
        (doc) => {
            console.log(doc);
            if (doc.nModified == 1) { res.json({ msg: true }) } else { res.json({ msg: false }) }
        }
    )
})

module.exports = router