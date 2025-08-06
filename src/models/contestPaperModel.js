// models/User.js
import mongoose from "mongoose";

const contestPaper = new mongoose.Schema(
    {
        contestName: {
            type: String,
            required: true,
        },
        contestPaper: {
            type: [],
            required: true,
        },
        isContestLocked:{
            type: Boolean,
            default: false
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

const Paper = mongoose.model("Paper", contestPaper);

export default Paper;
