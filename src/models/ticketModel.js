// models/User.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        paymentId:{
            type: Object,
            required: true,
        },
        ticketId: {
            type: String,
            required: true,
            unique: true
        },
        contestName: {
            type: String,
            required: true,
        },
        salePrice: {
            type: String,
            required: true,
        },
        resalePrice: {
            type: String,
            default: "NA"
        },
        poolPrize: {
            type: String,
            required: true,
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

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
