// models/User.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
        },
        transferee: {
            type: String,
            required: true
        },
        newpaymentId:{
            type: String,
            required: true,
        },
        transferor:{
            type: String,
            required: true
        },
        transferAmount: {
            type: String,
            required: true
        },
        isTransfer: {
            type: Boolean,
            default: false
        },
        isAmountTransfered: {
            type: Boolean,
            default: false
        },
        oldPaymentId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Boolean
        }
    },
    { timestamps: true }
);

const Transfer = mongoose.model("Transfer", ticketSchema);

export default Transfer;
