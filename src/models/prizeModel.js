import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
    {
        contestName: {
            type: String,
            required: true,
        },
        rank: {
            type: String,
            required: true,
        },
        noOfPerson:{
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            required: true,
        },
        initialDistribution: {
            type: Number,
            required: true,
        },
        initialDistributionEach: {
            type: Number,
            required: true,
        },
        targetDistribution: {
            type: Number,
            required: true,
        },
        targetDistributionEach: {
            type: Number,
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

const Prize = mongoose.model("Prize", prizeSchema);

export default Prize;
