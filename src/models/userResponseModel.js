// models/User.js
import mongoose from "mongoose";

const userResponseSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        contestName: {
            type: String,
            required: true,
        },
        ticketId: {
            type: String,
            required: true
        },
        paperResponse: [
            {
                questionId: String,
                userResponse: String
            }
        ],
        isSubmitted: {
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

const UserResponse = mongoose.model("UserResponse", userResponseSchema);

export default UserResponse;
