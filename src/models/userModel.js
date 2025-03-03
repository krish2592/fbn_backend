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
        firstName: {
            type: String,
            // Do lower case
        },
        lastName: {
            type: String,
            // Do lower case
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // Allows unique index for cases where email is optional
            // Do lower case
        },
        profilePicture: {
            type: String, // URL to the profile picture
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
