// models/User.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        holdAmount:{
            type: String
        },
        soldAmount: {
            type: String
        },
        profit: {
            type: String
        },
        loss: {
            type: String
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

const Portfolio = mongoose.model("Portfolio", ticketSchema);

export default Portfolio;
