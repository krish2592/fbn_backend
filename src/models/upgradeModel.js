// models/User.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true
        },
        newpaymentId:{
            type: String,
            required: true,
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

const Upgrade = mongoose.model("Upgrade", ticketSchema);

export default Upgrade;
