const express = require('express');
const router = express.Router();
const generatePDF = require('../payablePDFs/purchasePDF/purchasePDFGenerat');
const PRequisition = require('../models/purchaseRequisition')
const PurchasOrder = require('../models/purchaseOrder');
const User=require('../models/user')


// import multer
const multer=require('multer');
// import path from core
const path=require('path');

// image will replace the path backend/uploads 
router.use('/images', express.static(path.join('backend/uploads')))
// this will define the type of file you will accept
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// multer configuration
const storageConfig = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        if (isValid) {
            cb(null, 'backend/uploads')
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-easyErp-' + '.' + extension;
        cb(null, imgName);
    }
});  




// Add Purchas Order
router.post("/", multer({storage:storageConfig}).single('price'), (req, res) => {
    console.log(req.body);
    let id = `PO-${req.body.purchaseOrder}`
    console.log(id);
    PRequisition.findById(req.body.purchaseRequsitionsID).then(
        (foundedPR) => {
            if (!foundedPR) {
                res.json({ msg: "Purchase Requisition does not exist" })
            } else {
                User.findById(req.body.userID).then(
                    (foundedUser)=>{
                        if (!foundedUser) {
                            res.json({msg:"user not found"})
                        } else {
                            PurchasOrder.findOne({ purchaseOrder: id }).then(
                                (doc) => {
                                    console.log(doc);
                                    if (doc) {
                                        res.json({ msg: "purchase Order alredy exist" })
                                    } else {
                                        const products = JSON.parse(req.body.products);
                                        let purchaseOrder = new PurchasOrder({
                                            documentName: "Purchase Order",
                                            purchaseOrder: id,
                                            poDate: req.body.date,
                                            date: req.body.aprdate,
                                            amount: req.body.amount,
                                            products:products,
                                            // products: req.body.products, // List of items or services ordered
                                            approval: {
                                                status: "Pending",
                                               
                                                approvedBy: req.body.approvedBy
                                            },
                                            discountsAndAdjustments: {
                                                discountTerms: req.body.discountTerms,
                                                discount: req.body.discount,
                                                adjustments: req.body.adjustments,
                                            },
                                            purchaseRequsitionsID: foundedPR._id,
                                            userID: foundedUser._id,
                                        })
                                        purchaseOrder.save(async (err, doc) => {
                                            if (err) {
                                                console.error("Error saving purchase order:", err);
                                                return res.status(500).json({ msg: "Error saving purchase order", error: err.message });
                                            }
                                            if (!doc) {
                                                return res.status(400).json({ msg: "Failed to save purchase order" });
                                            }
                                        
                                            try {
                                                // Generate the PDF and get the path
                                                const pdfPath = await generatePDF(JSON.stringify(doc));
                                                console.log(`PDF saved at: ${pdfPath}`);
                                        
                                                // Save the PDF path in the purchase order document
                                                doc.pdf = `http://localhost:3000/puchaseOrder/pdf/${path.basename(pdfPath)}`;
                                                console.log(doc)
                                                await doc.save();
                                        
                                                // Update the related PR and User collections
                                                foundedPR.purchaseOrders.push(doc._id);
                                                await foundedPR.save();
                                        
                                                foundedUser.purchaseOrdersID.push(doc._id);
                                                await foundedUser.save();
                                        
                                                // Respond with success and the PDF path
                                                return res.json({ msg: "Purchase order added successfully", path: pdfPath });
                                            } catch (error) {
                                                console.error("Error generating PDF:", error);
                                                return res.status(500).json({ msg: "Error generating PDF", error: error.message });
                                            }
                                        });
                                        
                                        // purchaseOrder.save((err, doc) => {
                                        //     console.log(err);
                                        //     if (doc) {
                                        //         // effect IDs to PR and user collections
                                        //         foundedPR.purchaseOrders.push(doc._id)
                                        //         foundedPR.save()
                                        //         foundedUser.purchaseOrdersID.push(doc._id)
                                        //         foundedUser.save()
                                        //         res.json({ msg: "added" });
                                        //     } else {
                                        //         res.json({ msg: "error" });
                                        //     }
                                        //     if (doc) {
                                        //         if (generatePDF(JSON.stringify(doc))) {
                                        //             res.json({ msg: "added" });
                                        //         };
                                        //     }
                                        // })
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
// Update Purchas Order
router.put("/", (req, res) => {
    PurchasOrder.updateOne({ _id: req.body._id }, req.body).then(
        (doc) => {
            console.log(doc)
            if (doc.nModified == 1) { res.json({ msg: "updated" }) } else { res.json({ msg: "update error" }) };
        }
    )
})
// Get Purchas Order By ID
router.get("/:id", (req, res) => {
    PurchasOrder.findById({ _id: req.params.id }).then(
        (doc) => {
            if (doc) { res.json({ msg: "here pushase Order", purchase: doc }) } else { res.json({ msg: "no pushase Order" }) }
        }
    )

})
// Get Purchas Order By ID
router.get("/edit-payables/POs/:id", (req, res) => {
    PurchasOrder.findById({ _id: req.params.id }).then(
        (doc) => {
            if (doc) { res.json({ msg: "here pushase Order", purchase: doc }) } else { res.json({ msg: "no pushase Order" }) }
        }
    )

})

// Get all Purchas Orders
router.get("/", (req, res) => {
    PurchasOrder.find().populate("purchaseRequsitionsID").then(
        (docs) => {
            if (docs) { res.json({ msg: "here puschases", purchases: docs }) } else { res.json({ msg: "no puschases" }) }
        }
    )
})
// Delete Purches Order By ID
router.delete("/:id", (req, res) => {
    console.log(req.params.id);

    PurchasOrder.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) { res.json({ msg: "deleted" }) } else { res.json({ msg: "deleted error" }) }
        }
    )
})

// charts visualization
router.get("/totals/purchases", async (req, res) => {
    try {
        const totalPurchases = await PurchaseOrder.aggregate([
            { $match: { status: "Completed" } }, // Include only completed purchase orders
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.json({ totalPurchases: totalPurchases[0]?.total || 0 });
    } catch (err) {
        res.status(500).json({ msg: "Error calculating purchases total", error: err.message });
    }
});


module.exports = router;