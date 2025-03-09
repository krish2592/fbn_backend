// models/User.js
import mongoose from "mongoose";

const userKYCSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        idProof: {
            type:String,
            required: true,
            lowercase: true,
        },
        idNumber: {
            type:String,
            required: true
        },
        nameOnId: {
            type: String,
            lowercase: true,
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

const UserKYC = mongoose.model("UserKYC", userKYCSchema);

export default UserKYC;
