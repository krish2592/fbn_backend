// models/User.js
import mongoose from "mongoose";

const userSupportSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        ticketId: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
            lowercase: true,
        },
        status: {
            type: String,
            default: "Pending"
        },
        messages: [
            {
                senderId: String,
                sender: String,
                message: String,
                timestamp: Number
            }
        ],
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

const Support = mongoose.model("Support", userSupportSchema);

export default Support;
