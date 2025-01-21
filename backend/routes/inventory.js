const express = require('express');
const router = express.Router();

const { Inventory, InventoryMovement } = require('../models/inventory');

//get all inventoy
router.get('/', async (req, res) => {
    try {
        const inv = await Inventory.find();
        console.log(inv);

        res.json({ inventory: inv });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching inventory', details: err.message });
    }
});
//get inventory item by ID
router.get('/:id', async (req, res) => {
    try {
        const inventoryItem = await Inventory.findById(req.params.id);
        if (!inventoryItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ item: inventoryItem });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching item', details: err.message });
    }
});
//add inventory item
router.post('/', async (req, res) => {
    console.log(req.body);
    Inventory.findOne({ productName: req.body.productName, "supplierDetails.name": req.body.name }).then(
        (product) => {
            console.log(product)
            if (!product) {
                try {
                    let newItem = new Inventory({
                        productName: req.body.productName,
                        productCode: req.body.code,
                        category: req.body.category,
                        desqription: req.body.desqription,
                        quantity: req.body.quantity,
                        restockThreshold: req.body.alertQuantity,
                        purchasePricePerUnit: req.body.purchasingPrice,
                        sellsPricePerUnit: req.body.sellingPrice,
                        supplierDetails: {
                            name: req.body.name,
                            address: req.body.address,
                            email: req.body.email,
                            phone: req.body.phone,
                        },
                    });
                    console.log(newItem);
                    newItem.save();
                    res.status(201).json({ msg: "added with success" });
                } catch (err) {
                    res.status(400).json({ error: 'Error creating item', details: err.message });
                }
            }
        }
    )

});

//update inventory item
router.put('/newInfo', async (req, res) => {
    console.log(req.body)
    try {
        const updatedItem = await Inventory.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true });
        console.log("here the new object", updatedItem);
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ updatedItem: updatedItem });
        console.log(updatedItem);

    } catch (err) {
        res.status(400).json({ error: 'Error updating item', details: err.message });
    }
});
//delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ msg: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting item', details: err.message });
    }
});


//sell ou purchase item
router.post('/movement', async (req, res) => {
    try {
        const { productCode, movementType, quantity, description } = req.body;
        console.log(req.body)
        // Validate inventory item
        const inventoryItem = await Inventory.findOne({ productCode });
        if (!inventoryItem) return res.status(404).json({ error: 'Product not found' });

        // Adjust inventory quantity
        if (movementType === 'incoming') {
            inventoryItem.quantity += quantity;
        } else if (movementType === 'outgoing') {
            if (inventoryItem.quantity < quantity) {
                return res.status(400).json({ error: 'Insufficient stock for outgoing movement' });
            }
            inventoryItem.quantity -= quantity;
        } else {
            return res.status(400).json({ error: 'Invalid movement type' });
        }

        // Save updated inventory
        await inventoryItem.save();

        // Log movement
        const movement = new InventoryMovement({
            productCode,
            movementType,
            quantity,
            description,
        });
        await movement.save();

        res.status(201).json({ message: 'Movement logged successfully', movement });
    } catch (err) {
        res.status(400).json({ error: 'Error logging movement', details: err.message });
    }
});

// get item sells or purchases movment
router.get('/movement/:productCode', async (req, res) => {
    try {
        console.log(req.params.productCode);

        const mov = await InventoryMovement.find({ productCode: req.params.productCode }).sort({ date: -1 });
        res.json({ movements: mov });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching movements', details: err.message });
    }
});

// get all sells or purchases movment
router.get('/movements', async (req, res) => {
    try {
        const movements = await InventoryMovement.find().sort({ date: -1 });
        res.json(movements);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching movements', details: err.message });
    }
});

// Endpoint to calculate sales growth
router.get('/sales/growth', async (req, res) => {
    try {
        // Aggregate data for movements
        const movements = await InventoryMovement.aggregate([
            {
                $lookup: {
                    from: 'inventories',
                    localField: 'productCode',
                    foreignField: 'productCode',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $group: {
                    _id: '$description',
                    totalQuantity: { $sum: '$quantity' },
                    totalValue: { $sum: { $multiply: ['$quantity', '$productDetails.sellsPricePerUnit'] } },
                },
            },
        ]);

        // Extract data for each description
        let totalSales = 0;
        let totalReceipts = 0;
        let totalExpenses = 0;

        movements.forEach((movement) => {
            if (movement._id === 'Sell') {
                totalSales += movement.totalValue;
            } else if (movement._id === 'Purchase') {
                totalReceipts += movement.totalValue;
                // totalExpenses += movement.totalValue; // Expenses are based on purchases
            } else if (movement._id === 'Transfer' || movement._id === 'Damage') {
                totalExpenses += movement.totalValue;
            }
        });

        // Calculate earnings
        const earnings = totalSales - totalExpenses;
        let total = {
            totalSales,
            totalReceipts,
            totalExpenses,
            earnings,
        }
        res.status(200).json({
            total
        });
    } catch (error) {
        console.error('Error calculating sales growth:', error);
        res.status(500).json({ message: 'Error calculating sales growth' });
    }
});

// router.get('/sales/growth', async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         let matchStage = {}; // Default: no date filtering
//         if (startDate && endDate) {
//             matchStage = {
//                 date: { $gte: new Date(startDate), $lte: new Date(endDate) },
//             };
//         }

//         // Aggregate data for movements with optional date filtering
//         const movements = await InventoryMovement.aggregate([
//             {
//                 $match: matchStage, // Apply date filter if provided
//             },
//             {
//                 $lookup: {
//                     from: 'inventories',
//                     localField: 'productCode',
//                     foreignField: 'productCode',
//                     as: 'productDetails',
//                 },
//             },
//             {
//                 $unwind: '$productDetails',
//             },
//             {
//                 $group: {
//                     _id: '$description',
//                     totalQuantity: { $sum: '$quantity' },
//                     totalValue: { $sum: { $multiply: ['$quantity', '$productDetails.sellsPricePerUnit'] } },
//                 },
//             },
//         ]);

//         // Extract data for each description
//         let total={}

//         movements.forEach((movement) => {
//             if (movement._id === 'Sell') {
//                 total.totalSales += movement.totalValue;
//             } else if (movement._id === 'Purchase') {
//                 total.totalReceipts += movement.totalValue;
//             } else if (movement._id === 'Transfer' || movement._id === 'Damage') {
//                 total.totalExpenses += movement.totalValue;
//             }
//         });
//    // Aggregate sales data (Sell movements) grouped by date
//    const salesGrowth = await InventoryMovement.aggregate([
//     {
//         $match: {
//             description: 'Sell',
//             date: { $gte: start, $lte: end }, // Filter by date range
//         },
//     },
//     {
//         $group: {
//             _id: dateFormat, // Group by formatted date
//             totalSales: { $sum: { $multiply: ['$quantity', '$sellsPricePerUnit'] } },
//             totalQuantity: { $sum: '$quantity' },
//         },
//     },
//     { $sort: { _id: 1 } }, // Sort by date ascending
// ]);
//         // Calculate earnings
//         totalearnings = totalSales - totalExpenses;

//         res.status(200).json({
//             totalSales,
//             totalReceipts,
//             totalExpenses,
//             earnings,
//         });
//     } catch (error) {
//         console.error('Error calculating sales growth:', error);
//         res.status(500).json({ message: 'Error calculating sales growth' });
//     }
// });


//  Reports (weekly/monthly/yearly)
router.get('/inventory/reports', async (req, res) => {
    try {
        // Extract start and end dates from query parameters
        const { startDate, endDate } = req.query;

        // Convert to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Aggregate movements within the specified date range
        const movements = await InventoryMovement.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end } // Filter by date range
                }
            },
            {
                $group: {
                    _id: '$description',
                    totalQuantity: { $sum: '$quantity' },
                    totalValue: { $sum: { $multiply: ['$quantity', '$productDetails.sellsPricePerUnit'] } }
                }
            }
        ]);

        res.status(200).json({ movements });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});


module.exports = router