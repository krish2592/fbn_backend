// models/User.js
import mongoose from "mongoose";

const contestModel = new mongoose.Schema(
    {
        contestName: {
            type: String,
            required: true,
        },
        contestId: {
            type: String,
            required: true,
        },
        totalQuantity: {
            type: Number,
            required: true,
        },
        quantitySold: {
            type: Number,
            default: 0
        },
        initialPrice: {
            type: String,
            required: true
        },
        todayPrice: {
            type: String,
            required: true
        },
        initialPoolPrize: {
            type: String,
            required: true
        },
        targetPoolPrize: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        maxDuration: {
            type: String,
            required: true
        },
        contestType: {
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

const Contest = mongoose.model("Contest", contestModel);

export default Contest;
