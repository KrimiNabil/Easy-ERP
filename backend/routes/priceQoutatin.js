const express = require("express");
const router = express.Router();

const PQ = require("../models/priceQuotation");
const User = require("../models/user")
const generatePDF = require("../payablePDFs/quotationPDF/quotationPDFGenerat");
const path = require("path");

// Add Purchase Quotation
router.post("/", async (req, res) => {
    console.log("here obj from FE", req.body.products);
    try {
        const id = `Price-Quotation-${req.body.quotationNumber}`;
        const existingPQ = await PQ.findOne({ quotationNumber: id });
        if (existingPQ) {
            return res.json({ msg: "Purchase Quotation already exists" });
        } else {
            User.findById({ _id: req.body.userId }).then(
                (foundedUser) => {
                    const pq = new PQ({
                        quotationNumber: id,
                        date: req.body.date,
                        supplier: {
                            email: req.body.customerEmail,
                        },
                        amount: req.body.amount,
                        currency: req.body.currency,
                        items:  req.body.products,
                            
                        termsAndConditions: req.body.termsAndConditions,
                        createdBy: foundedUser._id,
                    });
                    console.log("here obj created", pq);
                    pq.save(async (err, doc) => {
                        console.log("here error", err);
                        if (doc) {
                            console.log("here obj saved", doc);
                            // Generate PDF
                            const pdfPath = await generatePDF(JSON.stringify(doc));
                            doc.pdf = `http://localhost:3000/pq/pdf/${path.basename(pdfPath)}`;
                            foundedUser.priceQuotationID = doc._id;
                            if (foundedUser.entityID) {
                                doc.entityID = foundedUser.entityID
                            }
                            await foundedUser.save();
                            await doc.save();
                            res.json({ msg: "Purchase Quotation added successfully", path: doc.pdf });
                        }
                    });
                }
            )
        }
    } catch (err) {
        console.error("Error saving PQ:", err);
        res.status(500).json({ msg: "Error saving PQ", error: err.message });
    }
});

// Get PQ By ID
router.get("/:id", async (req, res) => {
    try {
        const pq = await PQ.findById(req.params.id);

        if (!pq) {
            return res.json({ msg: "PQ not found" });
        }

        res.json({ msg: "Here is the PQ", pq });
    } catch (err) {
        console.error("Error fetching PQ:", err);
        res.status(500).json({ msg: "Error fetching PQ", error: err.message });
    }
});

// Get All PQs
router.get("/", async (req, res) => {
    try {
        const pqs = await PQ.find();

        if (pqs.length === 0) {
            return res.json({ msg: "No PQs found" });
        }

        res.json({ msg: "Here are all PQs", quotations: pqs });
    } catch (err) {
        console.error("Error fetching PQs:", err);
        res.status(500).json({ msg: "Error fetching PQs", error: err.message });
    }
});

// Update PQ
router.put("/", async (req, res) => {
    try {
        const updatedPQ = await PQ.updateOne({ _id: req.body._id }, req.body);

        if (updatedPQ.nModified === 1) {
            return res.json({ msg: "PQ updated successfully" });
        }

        res.json({ msg: "Update error or no changes made" });
    } catch (err) {
        console.error("Error updating PQ:", err);
        res.status(500).json({ msg: "Error updating PQ", error: err.message });
    }
});

// Delete PQ By ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedPQ = await PQ.deleteOne({ _id: req.params.id });

        if (deletedPQ.deletedCount === 1) {
            return res.json({ msg: "PQ deleted successfully" });
        }

        res.json({ msg: "Delete error or PQ not found" });
    } catch (err) {
        console.error("Error deleting PQ:", err);
        res.status(500).json({ msg: "Error deleting PQ", error: err.message });
    }
});

// update statuse PQ
router.put("/updateStatuse/:id", async (req, res) => {
    try {
        let newStatuse = req.body.status
        console.log(newStatuse);

        const pq = await PQ.findById(req.params.id);
        console.log(pq);

        if (!pq) {
            return res.status(404).json({ msg: "PQ not found" });
        }



        pq.status = newStatuse;


        await pq.save();

        res.json({ msg: "PQ successfully updated", update: pq.status });
    } catch (err) {
        console.error("Error canceling PQ:", err);
        res.status(500).json({ msg: "Error canceling PQ", error: err.message });
    }
});

// Calculate Total for PQs
router.get("/totals", async (req, res) => {
    try {
        const totalPQs = await PQ.aggregate([
            {
                $match: {
                    status: "Completed",
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        res.json({ totalPQs: totalPQs[0]?.total || 0 });
    } catch (err) {
        console.error("Error calculating PQ total:", err);
        res.status(500).json({ msg: "Error calculating PQ total", error: err.message });
    }
});

router.get('/dashboard/summary/quotation', async (req, res) => {
    try {
        // Fetch the last 6 quotations sorted by creation date (descending)
        const latestQuotations = await PQ.find()
            .sort({ createdAt: -1 })
            .limit(6);

        // Count total quotations for calculating percentages
        const totalQuotations = await PQ.countDocuments();

        // Group and count quotations by status
        const statusCounts = await PQ.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate percentage for each status
        const statusSummary = statusCounts.map((status) => ({
            status: status._id,
            percentage: ((status.count / totalQuotations) * 100).toFixed(2)
        }));

        // Sum total amounts for completed quotations
        const completedSumResult = await PQ.aggregate([
            { $match: { status: "Completed" } }, // Match only "Completed" status
            {
                $group: {
                    _id: null, // No grouping key, we want a single total
                    totalCompletedAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalCompletedAmount = completedSumResult.length > 0 ? completedSumResult[0].totalCompletedAmount : 0;

        res.status(200).json({
            last: latestQuotations,
            status: statusSummary,
            completedTotal: totalCompletedAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary', error });
    }
});


module.exports = router;
