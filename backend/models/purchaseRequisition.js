const mongoose = require('mongoose');

const purchaseRequisitionSchema = new mongoose.Schema({
    documentName:String,
    requisitionID: { type: String, required: true, unique: true }, // Unique identifier for the requisition
    requestDate: { type: Date, default: Date.now }, // Date the requisition was created
    dueDate: { type: Date }, // Date the items/services are needed by
    pdf:String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    }, // Workflow status
    requester: {
        name: { type: String }, // Name of the requester
        department: { type: String }, // Requesting department
        email: { type: String,  }, // Contact email
        phone: { type: String } // Optional contact number
    },
    products: [
        {
            productName: String,
            description:   String,
            quantity: Number ,
        }
    ],
    justification: { type: String }, // Reason for the requisition
    budgetCode: { type: String }, // Code for tracking expenses
    approval: {
        approvers: [
            {
                name: { type: String}, // Approver name
                email: { type: String }, // Approver email
                approvalStatus: {
                    type: String,
                    enum: ['Pending', 'Approved', 'Rejected'],
                    default: 'Pending'
                }, // Approval status
                approvalDate: { type: Date } // Date of approval/rejection
            }
        ],
        // finalApprovalStatus: {
        //     type: String,
        //     enum: ['Pending', 'Approved', 'Rejected'],
        //     default: 'Pending'
        // }, // Final status after all approvals
        // approvalNotes: { type: String } // Any notes from approvers
    },
    auditTrail: {
        createdBy: { type: String }, // Creator of the requisition
        createdAt: { type: Date, default: Date.now }, // Creation date
        updatedBy: { type: String }, // Last modifier
        updatedAt: { type: Date } // Last modification date
    },
    purchaseOrders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PuchaseOrder"
    }],
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }
    
});

const PurchaseRequisition = mongoose.model('PurchaseRequisition', purchaseRequisitionSchema);

module.exports = PurchaseRequisition;
