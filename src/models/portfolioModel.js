// models/User.js
import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        holdAmount:{
            type: Number,
            default: 0.00
        },
        holdQuantity: {
            type: Number,
            default: 0
        },
        soldAmount: {
            type: Number,
            default: 0.00
        },
        soldQuantity: {
            type: Number,
            default: 0
        },
        profit: {
            type: Number,
            default: 0.00
        },
        loss: {
            type: Number,
            default: 0.00
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

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
