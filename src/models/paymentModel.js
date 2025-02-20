// models/User.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        razorpayPaymentId:{
            type: String,
            required: true,
            unique: true,
        },
        contestName: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
        pricePerQuantity: {
            type: String,
            required: true,
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        ticketStatus: {
            type: String,
            default: "Pending"
        },
        status: {
            type: String,
            required: true,
        },
        description: {
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

const User = mongoose.model("Payment", paymentSchema);

export default User;
