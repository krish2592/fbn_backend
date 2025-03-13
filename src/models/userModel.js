// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            sparse: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            lowercase: true,
            default:null
        },
        email: {
            type: String,
            unique: true,
            sparse: true, 
            lowercase: true,
        },
        profilePicture: {
            type: String, 
        },
        dob: { 
            type: Date,
            default:null
        },
        refreshToken: {
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

const User = mongoose.model("User", userSchema);

export default User;
